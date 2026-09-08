(function(){'use strict';
function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function cn(n){let s='';while(n){n--;s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26)}return s}
function dc(a){const m=/^([A-Z]+)(\d+)$/.exec(a);let c=0;for(const x of m[1])c=c*26+x.charCodeAt(0)-64;return{c:c-1,r:+m[2]-1}}
function decode_range(s){const[a,b]=s.split(':');return{s:dc(a),e:dc(b||a)}}
function aoa_to_sheet(d){return{_data:d||[]}}
function book_new(){return{SheetNames:[],Sheets:{},Props:{}}}
function book_append_sheet(w,s,n){w.SheetNames.push(n);w.Sheets[n]=s}
function cellXml(v,r,c,style){const ref=cn(c+1)+(r+1),s=style!=null?` s="${style}"`:'';if(typeof v==='number'&&Number.isFinite(v))return`<c r="${ref}"${s}><v>${v}</v></c>`;return`<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${esc(v??'')}</t></is></c>`}
function styleForRow(r,ws){if(ws['!rowStyles']&&ws['!rowStyles'][r]!=null)return ws['!rowStyles'][r];if(r===0)return 5;if(r===1)return 11;if(r===2)return 15;if(r===4)return 22;if(r>=5)return 30;return 0}
function sheetXml(ws){
 const d=ws._data||[],lastRow=Math.max(5,d.length),lastCol=Math.max(23,...d.map(x=>(x||[]).length));
 const cols=(ws['!cols']||[]).map((x,i)=>`<col min="${i+1}" max="${i+1}" width="${Number(x.wch||10)}" customWidth="1"/>`).join('');
 const rows=d.map((a,r)=>{const h=ws['!rows']?.[r]?.hpt,st=styleForRow(r,ws);return`<row r="${r+1}"${h?` ht="${h}" customHeight="1"`:''}>${(a||[]).map((v,c)=>cellXml(v,r,c,st)).join('')}</row>`}).join('');
 const merges=(ws['!merges']||[]).map(x=>`<mergeCell ref="${cn(x.s.c+1)}${x.s.r+1}:${cn(x.e.c+1)}${x.e.r+1}"/>`).join('');
 const af=ws['!autofilter']?`<autoFilter ref="${esc(ws['!autofilter'].ref)}"/>`:'',m=ws['!margins']||{},p=ws['!pageSetup']||{},fr=ws['!freeze'];
 const br=(ws['!rowBreaks']||[]).map(id=>`<brk id="${id}" min="0" max="16383" man="1"/>`).join('');
 const brXml=br?`<rowBreaks count="${ws['!rowBreaks'].length}" manualBreakCount="${ws['!rowBreaks'].length}">${br}</rowBreaks>`:'';
 const views=fr?`<sheetViews><sheetView workbookViewId="0"><pane ySplit="${fr.ySplit||0}" topLeftCell="${fr.topLeftCell||'A1'}" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="${fr.topLeftCell||'A1'}" sqref="${fr.topLeftCell||'A1'}"/></sheetView></sheetViews>`:`<sheetViews><sheetView workbookViewId="0"/></sheetViews>`;
 return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetPr><pageSetUpPr fitToPage="1" autoPageBreaks="0"/></sheetPr><dimension ref="A1:${cn(lastCol)}${lastRow}"/>${views}<sheetFormatPr defaultRowHeight="15"/>${cols?`<cols>${cols}</cols>`:''}<sheetData>${rows}</sheetData>${af}${merges?`<mergeCells count="${ws['!merges'].length}">${merges}</mergeCells>`:''}<printOptions horizontalCentered="0" verticalCentered="0" headings="0" gridLines="0"/><pageMargins left="${m.left??.2}" right="${m.right??.2}" top="${m.top??.35}" bottom="${m.bottom??.35}" header="${m.header??.15}" footer="${m.footer??.15}"/><pageSetup paperSize="${p.paperSize||9}" orientation="${p.orientation||'landscape'}" fitToWidth="${p.fitToWidth??1}" fitToHeight="${p.fitToHeight??0}" pageOrder="downThenOver"/>${brXml}</worksheet>`}
async function writeFile(wb,name){
 if(!window.JSZip)throw new Error('Mesin ZIP lokal tidak tersedia.');
 const res=await fetch('./excel-template-a4.xlsx?v=1',{cache:'no-store'});if(!res.ok)throw new Error(`Template Excel lokal gagal dimuat (HTTP ${res.status}).`);
 const zip=await JSZip.loadAsync(await res.arrayBuffer());
 const sheets=wb.SheetNames.map(n=>wb.Sheets[n]);
 sheets.forEach((ws,i)=>zip.file(`xl/worksheets/sheet${i+1}.xml`,sheetXml(ws)));
 if(sheets.length>1){
   const types=zip.file('[Content_Types].xml');
   let ct=await types.async('string');
   for(let i=2;i<=sheets.length;i++) if(!ct.includes(`/xl/worksheets/sheet${i}.xml`))
     ct=ct.replace('</Types>',`<Override PartName="/xl/worksheets/sheet${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`);
   zip.file('[Content_Types].xml',ct);

   let wbxml=await zip.file('xl/workbook.xml').async('string');
   wbxml=wbxml.replace(/<sheets>[\s\S]*?<\/sheets>/,
     '<sheets>'+wb.SheetNames.map((n,i)=>`<sheet name="${esc(n)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets>');
   zip.file('xl/workbook.xml',wbxml);

   let rels=await zip.file('xl/_rels/workbook.xml.rels').async('string');
   rels=rels.replace(/<Relationship[^>]+Type="http:\/\/schemas\.openxmlformats\.org\/officeDocument\/2006\/relationships\/worksheet"[^>]*\/>/g,'');
   const additions=wb.SheetNames.map((n,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('');
   rels=rels.replace('</Relationships>',additions+'</Relationships>');
   zip.file('xl/_rels/workbook.xml.rels',rels);
 }
 const blob=await zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',compression:'DEFLATE'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1200)
}
window.XLSX={utils:{aoa_to_sheet,decode_range,book_new,book_append_sheet},writeFile};window.KP_EXCEL_ENGINE_READY=Promise.resolve(window.XLSX);
console.info('Ketahanan Pangan Admin: mesin Excel template lokal aktif.');
})();