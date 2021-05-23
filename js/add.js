function getToken() {
  return localStorage.getItem('token');
}

async function getUserByToken(token) {
  try {
    const res = await axios.get('https://api.marktube.tv/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log('getUserByToken error', error);
    return null;  // try의 결과가 문제가 생겼을때 null을 toekn값에 넘겨준다.
  }
}

async function save(event) {
  event.preventDefault();
  event.stopPropagation();
  event.target.classList.add('was-validated');

  const titleElement = document.querySelector('#title');
  const messageElement = document.querySelector('#message');
  const authorElement = document.querySelector('#author');
  const urlElement = document.querySelector('#url');

  const title = titleElement.value;
  const message = messageElement.value;
  const author = authorElement.value;
  const url = urlElement.value;

  if (title === '' || message === '' || author === '' || url === '') {
    return;  // 진행하지 않도록 멈춤
  }

  const token = getToken();
  if (token === null) {
    location.assign('/login');
    return;
  }

  try {
    await axios.post(
      'https://api.marktube.tv/v1/book',
      {
        title,
        message,
        author,
        url,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,  // 어떤 사람이 추가한건지를 확인하기 위한 증명의 용도로 추가함.
        },
      },
    );
    location.assign('/');
  } catch (error) {
    console.log('save error', error);
    alert('책 추가 실패');
  }
}

function bindSaveButton() {
  const form = document.querySelector('#form-add-book');
  form.addEventListener('submit', save);
}

async function main() {
  // 버튼에 이벤트 연결
  bindSaveButton();

  // 토큰 체크
  const token = getToken();
  if (token === null) {
    location.assign('/login');
    return;
  }

  // 토큰으로 서버에서 나의 정보 받아오기
  const user = await getUserByToken(token);
  if (user === null) {
    localStorage.clear();
    location.assign('/login');
    return;
  }
}

document.addEventListener('DOMContentLoaded', main);
