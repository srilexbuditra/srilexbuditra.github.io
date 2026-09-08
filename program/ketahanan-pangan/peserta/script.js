const API = 'https://peserta-api.srilexbuditra.work';
const authView = document.getElementById('authView'),
	dashboardView = document.getElementById('dashboardView'),
	message = document.getElementById('authMessage');
const normalizeId = v => String(v || '').trim().toUpperCase().replace(/\s+/g, '');
const normalizeWa = v => String(v || '').replace(/\D/g, '').replace(/^0/, '62');

function msg(type, text) {
	message.className = 'message show ' + type;
	message.textContent = text
}

function clearMsg() {
	message.className = 'message';
	message.textContent = ''
}
document.querySelectorAll('.tab').forEach(b => b.onclick = () => {
	document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === b));
	document.querySelectorAll('.form').forEach(x => x.classList.toggle('active', x.dataset.panel === b.dataset.tab));
	clearMsg()
});
document.querySelectorAll('.showpass').forEach(b => b.onclick = () => {
	const i = b.parentElement.querySelector('input');
	i.type = i.type === 'password' ? 'text' : 'password';
	b.textContent = i.type === 'password' ? 'Lihat' : 'Sembunyikan'
});
async function request(path, options = {}) {
	const r = await fetch(API + path, {
		...options,
		credentials: 'include',
		headers: {
			Accept: 'application/json',
			...(options.body ? {
				'Content-Type': 'application/json'
			} : {}),
			...(options.headers || {})
		},
		cache: 'no-store'
	});
	let d = {};
	try {
		d = await r.json()
	} catch {}
	if (!r.ok) throw Object.assign(new Error(d.message || 'Permintaan belum dapat diproses.'), {
		status: r.status
	});
	return d
}

function statusLabel(s) {
	return ({
		submitted: 'Registrasi diterima',
		pending: 'Dalam proses',
		verified: 'Terverifikasi',
		revision: 'Perlu perbaikan',
		rejected: 'Tidak disetujui',
		approved: 'Disetujui'
	})[String(s || '').toLowerCase()] || String(s || '-')
}

function date(v) {
	if (!v) return '-';
	const d = new Date(String(v).includes('T') ? v : String(v).replace(' ', 'T') + 'Z');
	return Number.isNaN(d.getTime()) ? v : new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	}).format(d)
}

function renderParticipantTimeline(status) {
	const s = String(status || '').toLowerCase();
	const timeline = document.getElementById('participantTimeline');
	const summary = document.getElementById('progressSummary');
	const alert = document.getElementById('progressAlert');
	if (!timeline || !summary || !alert) return;

	const items = [...timeline.querySelectorAll('li')];
	items.forEach(item => item.classList.remove('done', 'active', 'stopped'));
	alert.hidden = true;
	alert.className = 'progress-alert';
	alert.textContent = '';

	let activeIndex = 1;
	if (s === 'submitted') activeIndex = 0;
	if (s === 'pending' || !s) activeIndex = 1;
	if (s === 'verified' || s === 'approved') activeIndex = 3;
	if (s === 'revision' || s === 'rejected') activeIndex = 1;

	items.forEach((item, index) => {
		if (index < activeIndex) item.classList.add('done');
		else if (index === activeIndex) item.classList.add('active');
	});

	if (s === 'verified' || s === 'approved') {
		items.forEach(item => { item.classList.remove('active'); item.classList.add('done'); });
		summary.textContent = 'Seluruh tahapan utama telah selesai.';
	} else if (s === 'revision') {
		items[1]?.classList.add('stopped');
		summary.textContent = 'Pemeriksaan membutuhkan perbaikan data.';
		alert.hidden = false;
		alert.classList.add('revision');
		alert.textContent = 'Perlu perbaikan: ikuti petunjuk pengelola program sebelum proses dilanjutkan.';
	} else if (s === 'rejected') {
		items[1]?.classList.add('stopped');
		summary.textContent = 'Proses berhenti pada tahap pemeriksaan.';
		alert.hidden = false;
		alert.classList.add('rejected');
		alert.textContent = 'Pendaftaran belum dapat disetujui. Hubungi pengelola program bila memerlukan informasi lebih lanjut.';
	} else if (s === 'submitted') {
		summary.textContent = 'Registrasi telah diterima dan menunggu pemeriksaan.';
	} else {
		summary.textContent = 'Data peserta sedang dalam tahap pemeriksaan.';
	}
}

function showDashboard(p) {
	authView.hidden = true;
	dashboardView.hidden = false;
	document.getElementById('dashName').textContent = p.nama || 'Peserta';
	document.getElementById('dashId').textContent = p.registration_id || '-';
	document.getElementById('dashStatus').textContent = statusLabel(p.status);
	document.getElementById('dashDate').textContent = date(p.created_at);
	document.getElementById('dashRegion').textContent = [p.kabupaten, p.provinsi].filter(Boolean).join(', ') || '-';
	document.getElementById('infoId').textContent = p.registration_id || '-';
	document.getElementById('infoName').textContent = p.nama || '-';
	document.getElementById('infoApplicant').textContent = p.status_pemohon || '-';
	document.getElementById('infoCommodity').textContent = p.komoditas || '-';
	document.getElementById('infoFertilizer').textContent = p.jenis_pupuk || '-';
	renderParticipantTimeline(p.status);
	const s = String(p.status || '').toLowerCase(),
		note = document.getElementById('statusNote'),
		cert = document.getElementById('certificateBtn');
	cert.hidden = true;
	if (s === 'verified') {
		note.textContent = 'Pendaftaran Anda telah terverifikasi. Sertifikat digital tersedia.';
		cert.href = '../verifikasi/sertifikat/?registration_id=' + encodeURIComponent(p.registration_id);
		cert.hidden = false
	} else if (s === 'revision') {
		note.textContent = p.status_note || 'Pendaftaran memerlukan perbaikan. Silakan mengikuti petunjuk dari pengelola program.'
	} else if (s === 'rejected') {
		note.textContent = p.status_note || 'Pendaftaran belum dapat disetujui. Hubungi pengelola program bila memerlukan informasi lebih lanjut.'
	} else {
		note.textContent = 'Pendaftaran Anda sedang diproses. Status akan diperbarui setelah pemeriksaan admin.'
	}
}

function showAuth() {
	dashboardView.hidden = true;
	authView.hidden = false
}
document.getElementById('activateForm').onsubmit = async e => {
	e.preventDefault();
	const form = e.currentTarget;
	clearMsg();
	const f = new FormData(form),
		pw = f.get('password');
	if (pw !== f.get('password_confirm')) return msg('error', 'Konfirmasi password tidak sama.');
	const btn = e.submitter;
	btn.disabled = true;
	btn.textContent = 'Mengaktifkan…';
	try {
		await request('/activate', {
			method: 'POST',
			body: JSON.stringify({
				registration_id: normalizeId(f.get('registration_id')),
				nik: String(f.get('nik') || '').trim(),
				whatsapp: normalizeWa(f.get('whatsapp')),
				password: pw
			})
		});
		const registrationId = normalizeId(f.get('registration_id'));
		form.reset();
		document.querySelector('[data-tab="login"]').click();
		document.querySelector('#loginForm [name="registration_id"]').value = registrationId;
		msg('ok', 'Akun berhasil diaktifkan. Silakan masuk menggunakan Nomor Registrasi dan password Anda.')
	} catch (x) {
		msg('error', x.message)
	} finally {
		btn.disabled = false;
		btn.textContent = 'Aktifkan Akun'
	}
};
document.getElementById('loginForm').onsubmit = async e => {
	e.preventDefault();
	const form = e.currentTarget;
	clearMsg();
	const f = new FormData(form),
		btn = e.submitter;
	btn.disabled = true;
	btn.textContent = 'Memeriksa…';
	try {
		const d = await request('/login', {
			method: 'POST',
			body: JSON.stringify({
				registration_id: normalizeId(f.get('registration_id')),
				password: f.get('password')
			})
		});
		showDashboard(d.participant)
	} catch (x) {
		msg('error', x.message)
	} finally {
		btn.disabled = false;
		btn.textContent = 'Masuk ke Dashboard'
	}
};
document.getElementById('logoutBtn').onclick = async () => {
	const btn = document.getElementById('logoutBtn');
	if (btn) btn.disabled = true;

	try {
		await request('/logout', {
			method: 'POST'
		});
	} catch (error) {
		console.warn('Logout API gagal, halaman tetap dimuat ulang untuk menyegarkan sesi.', error);
	} finally {
		window.location.reload();
	}
};
(async () => {
	try {
		const d = await request('/me');
		if (d.authenticated && d.participant) showDashboard(d.participant);
		else showAuth()
	} catch {
		showAuth()
	}
})();
