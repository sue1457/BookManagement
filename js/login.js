function getToken() {
  return localStorage.getItem('token');  // token값은 string이거나 null
}

async function login(event) {
  event.preventDefault();  // submit에 대한 로직이 내가 작성한것 이외에 작성되지 않도록 막아준다.
  event.stopPropagation();  // submit에 대한 정보가 상위로 전달되지 않도록 한다.

  const emailElement = document.querySelector('#email');
  const passwordElement = document.querySelector('#password');

  const email = emailElement.value;  // input 창 안에 있는 값을 얻어옴.
  const password = passwordElement.value;

  console.log(email, password);

  // 얻어온 value를 서버에 보내서 문제가 없는지 확인해야 한다.
  try {
    const res = await axios.post('https://api.marktube.tv/v1/me', {
      email,
      password,
    });
    const { token } = res.data;  // 받아온 값이 객체 형태이다.(const token = red.data.token;)
    if (token === undefined) {
      return;
    }
    localStorage.setItem('token', token);  // token을 storage에 넣어준다.
    location = '/';
  } catch (error) {
    const data = error.response.data;
    if (data) {
      const state = data.error;
      if (state === 'USER_NOT_EXIST') {
        alert('사용자가 존재하지 않습니다.');
      } else if (state === 'PASSWORD_NOT_MATCH') {
        alert('비밀번호가 틀렸습니다.');
      }
    }
  }
}

function bindLoginButton() {
  const form = document.querySelector('#form-login');
  form.addEventListener('submit', login);  // login이 submit에 대한 값을 가지고 시작된다.
}

async function main() {
  // 버튼에 이벤트 연결
  bindLoginButton();

  // 토큰 체크
  const token = getToken();
  if (token !== null) {
    location.assign('/');  // null이 아니면 token값이 있다는것이므로 index페이지로 옮겨간다.
    return;
  }
}

document.addEventListener('DOMContentLoaded', main);
