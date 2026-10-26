const designers = [
    { file: 'kanginyoung', name: '강인영' },
    { file: 'kogeonhee', name: '고건희' },
    { file: 'kwonsohyun', name: '권소현' },
    { file: 'kimgyungeun', name: '김경은' },
    { file: 'kimgyuri', name: '김규리' },
    { file: 'kimsoyeong', name: '김소영' },
    { file: 'kimjihan', name: '김지한' },
    { file: 'kimhaesol', name: '김해솔' },
    { file: 'parksihun', name: '박시훈' },
    { file: 'baesooa', name: '배수아' },
    { file: 'seokjiyo', name: '석지요' },
    { file: 'soninseo', name: '손인서' },
    { file: 'yangjiwoo', name: '양지우' },
    { file: 'yangchaeyeon', name: '양채연' },
    { file: 'ohkayoung', name: '오가영' },
    { file: 'wonkyubin', name: '원규빈' },
    { file: 'leejongwon', name: '이종원' },
    { file: 'jangnayeong', name: '장나영' },
    { file: 'jangjunseon', name: '장준선' },
    { file: 'junjin', name: '전진' },
    { file: 'jeongyugyeong', name: '정유경' },
    { file: 'jeonghyojeong', name: '정효정' },
    { file: 'chajunhwan', name: '차준환' },
    { file: 'choiminseo', name: '최민서' },
    { file: 'choiejuan', name: '최주안' },
    { file: 'choijikang', name: '최지강' },
    { file: 'choijinyeong', name: '최진영' },
    { file: 'hanhyeonseok', name: '한현석' }
];

const nav = document.getElementById('designer-nav');

if (nav) {
    // 현재 페이지 파일명에서 위치 찾기
    const current = location.pathname.split('/').pop().replace('.html', '');
    const idx = designers.findIndex(d => d.file === current);

    if (idx !== -1) {
        const prev = designers[idx - 1];
        const next = designers[idx + 1];

        if (prev) {
            nav.insertAdjacentHTML('beforeend', `
                <a href="${prev.file}.html" class="dn-btn dn-prev">
                <span class="dn-arrow"></span>
                <span class="dn-label"><small>PREV</small><strong>${prev.name}</strong></span>
                </a>`);
        }
        if (next) {
            nav.insertAdjacentHTML('beforeend', `
                <a href="${next.file}.html" class="dn-btn dn-next">
                <span class="dn-label"><small>NEXT</small><strong>${next.name}</strong></span>
                <span class="dn-arrow"></span>
                </a>`);
        }
    }
}