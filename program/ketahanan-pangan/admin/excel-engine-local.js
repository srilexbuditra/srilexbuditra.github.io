(function(){'use strict';
function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function cn(n){let s='';while(n){n--;s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26)}return s}
function dc(a){const m=/^([A-Z]+)(\d+)$/.exec(a);let c=0;for(const x of m[1])c=c*26+x.charCodeAt(0)-64;return{c:c-1,r:+m[2]-1}}
function decode_range(s){const[a,b]=s.split(':');return{s:dc(a),e:dc(b||a)}}
function aoa_to_sheet(d){return{_data:d||[]}} function book_new(){return{SheetNames:[],Sheets:{},Props:{}}}
function book_append_sheet(w,s,n){w.SheetNames.push(n);w.Sheets[n]=s}
function cell(v,r,c){let q=cn(c+1)+(r+1);if(typeof v==='number'&&isFinite(v))return`<c r="${q}"><v>${v}</v></c>`;return`<c r="${q}" t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`}
function sx(w){
 let d=w._data||[],rs=d.map((a,r)=>{let h=w['!rows']?.[r]?.hpt;return`<row r="${r+1}"${h?` ht="${h}" customHeight="1"`:''}>${(a||[]).map((v,c)=>cell(v,r,c)).join('')}</row>`}).join('');
 let cs=(w['!cols']||[]).map((x,i)=>`<col min="${i+1}" max="${i+1}" width="${x.wch||10}" customWidth="1"/>`).join('');
 let ms=(w['!merges']||[]).map(x=>`<mergeCell ref="${cn(x.s.c+1)}${x.s.r+1}:${cn(x.e.c+1)}${x.e.r+1}"/>`).join('');
 let mg=ms?`<mergeCells count="${w['!merges'].length}">${ms}</mergeCells>`:'',af=w['!autofilter']?`<autoFilter ref="${esc(w['!autofilter'].ref)}"/>`:'';
 let m=w['!margins']||{},p=w['!pageSetup']||{},fr=w['!freeze'];
 let views=fr?`<sheetViews><sheetView workbookViewId="0"><pane ySplit="${fr.ySplit||0}" topLeftCell="${fr.topLeftCell||'A1'}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`:`<sheetViews><sheetView workbookViewId="0"/></sheetViews>`;
 return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${views}<sheetFormatPr defaultRowHeight="15"/>${cs?`<cols>${cs}</cols>`:''}<sheetData>${rs}</sheetData>${mg}${af}<printOptions/><pageMargins left="${m.left??.2}" right="${m.right??.2}" top="${m.top??.35}" bottom="${m.bottom??.35}" header="${m.header??.15}" footer="${m.footer??.15}"/><pageSetup paperSize="${p.paperSize||9}" orientation="${p.orientation||'landscape'}" fitToWidth="${p.fitToWidth??1}" fitToHeight="${p.fitToHeight??0}"/></worksheet>`}
async function writeFile(wb,name){
 if(!window.JSZip)throw new Error('Mesin ZIP lokal tidak tersedia.');
 const z=new JSZip(),sn=wb.SheetNames[0],ws=wb.Sheets[sn],P=wb.Props||{},now=new Date().toISOString();
 z.file('[Content_Types].xml',`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`);
 z.folder('_rels').file('.rels',`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`);
 z.folder('xl').file('workbook.xml',`<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${esc(sn)}" sheetId="1" r:id="rId1"/></sheets></workbook>`);
 z.folder('xl').folder('_rels').file('workbook.xml.rels',`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`);
 z.folder('xl').folder('worksheets').file('sheet1.xml',sx(ws));
 z.folder('docProps').file('core.xml',`<?xml version="1.0" encoding="UTF-8"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${esc(P.Title||'')}</dc:title><dc:creator>${esc(P.Author||'')}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created></cp:coreProperties>`);
 z.folder('docProps').file('app.xml',`<?xml version="1.0" encoding="UTF-8"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Ketahanan Pangan</Application><Company>${esc(P.Company||'')}</Company></Properties>`);
 let b=await z.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',compression:'DEFLATE'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)
}
window.XLSX={utils:{aoa_to_sheet,decode_range,book_new,book_append_sheet},writeFile};window.KP_EXCEL_ENGINE_READY=Promise.resolve(window.XLSX);
console.info('Ketahanan Pangan Admin: mesin Excel lokal aktif.');
})();