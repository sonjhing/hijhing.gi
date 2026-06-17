# HTML & CSS 기초 정리

## HTML

### 기본 구조

```html
<!DOCTYPE html>
<html>
<head>
    <!-- 웹사이트 정보, 외부 자료 연결 -->
    <title>제목</title>
</head>

<body>
    <!-- 실제 화면에 표시되는 내용 -->
</body>
</html>
```

---

## 태그 기본 문법

```html
<태그>내용</태그>
```

예시

```html
<title>제목</title>
```

---

## 제목 태그 (Heading)

글씨 크기를 나타내는 태그입니다.

```html
<h1>H1</h1>
<h2>H2</h2>
<h3>H3</h3>
<h4>H4</h4>
<h5>H5</h5>
<h6>H6</h6>
```

* h1 : 가장 큼
* h6 : 가장 작음

---

## 문단 태그

긴 문장을 작성할 때 사용합니다.

```html
<p>긴 문장</p>
```

글자 크기 변경

```html
<p style="font-size:50px;">
    안녕하세요.
</p>
```

텍스트 강조

```html
<strong>강조 텍스트</strong>
```

줄바꿈

```html
<br/>
```

예시

```html
<p style="font-size:50px;">
    <strong>안녕하세요.</strong>
    <br/>
    텍스트를 넣을 수 있습니다.
</p>
```

---

## 입력창 (Input)

```html
<input type="text">
```

속성

```html
<input
    type="text"
    style="width:500px; height:100px; font-size:30px;"
>
```

주요 타입

```html
<input type="text">
<input type="email">
<input type="password">
<input type="date">
```

---

## 버튼 (Button)

```html
<button>버튼</button>
```

크기 지정

```html
<button
    style="width:500px; height:100px; font-size:30px;"
>
    버튼
</button>
```

---

## 영역 나누기 (Div)

구역을 나누거나 묶을 때 사용합니다.

```html
<div>
    <button>버튼1</button>
</div>

<div>
    <button>버튼2</button>
</div>
```

가로 정렬

```html
<div style="display:flex;">
    <button>버튼1</button>
    <button>버튼2</button>
</div>
```

---

## 링크 (a)

다른 웹사이트로 이동

```html
<a href="https://example.com">
    이동하기
</a>
```

---

## 이미지 (img)

```html
<img
    src="이미지주소"
    alt="이미지 로드 실패"
>
```

---

## 리스트

### 순서 없는 목록

```html
<ul>
    <li>항목1</li>
    <li>항목2</li>
</ul>
```

### 순서 있는 목록

```html
<ol>
    <li>항목1</li>
    <li>항목2</li>
</ol>
```

---

## 표 (Table)

```html
<table
    summary="테이블"
    style="width:500px; height:250px;"
>
    <caption>테이블 이름</caption>

    <tr>
        <th>이름</th>
    </tr>

    <tr>
        <td>춘식이</td>
    </tr>
</table>
```

---

## Form

사용자 입력을 받는 영역

```html
<form>

    <input
        type="text"
        style="font-size:20px;"
    >

    <input
        type="email"
        style="font-size:20px;"
    >

    <input
        type="password"
        style="font-size:20px;"
    >

    <input
        type="date"
        style="font-size:20px;"
    >

    <label>
        <input type="checkbox">
        체크박스
    </label>

    <br/>

    <button
        type="submit"
        style="font-size:20px;"
    >
        완료
    </button>

</form>
```

---

## 선택창 (Select)

```html
<select name="coffee">

    <option value="1">
        아메리카노
    </option>

    <option value="2">
        카페라떼
    </option>

</select>
```

---

# CSS

## 기본 문법

```css
selector {
    property: value;
}
```

예시

```css
h1 {
    color: red;
    font-size: 12px;
}
```

---

## CSS 적용 방법

### 1. 인라인 방식

```html
<p style="color:blue;">
    텍스트
</p>
```

---

### 2. 내장 방식

```html
<head>

<style>
.logo {
    color:#eeeeee;
}
</style>

</head>
```

---

### 3. 링크 방식

```html
<head>

<link
    href="style.css"
    rel="stylesheet"
>

</head>
```

---

### 4. Import 방식

```html
<style>
@import url("style.css");
</style>
```

---

## 버튼 스타일 예시

```css
button {

    width:200px;
    height:60px;

    background-color:#007acc;

    border:none;

    color:white;

    box-shadow:0 4px 10px rgba(0,0,0,.2);

    font-size:18px;
    font-weight:bold;

    border-radius:10px;

    transition:.3s;
}
```

포커스

```css
button:focus {
    outline:none;
}
```

마우스 오버

```css
button:hover {

    background-color:#0094ff;

    cursor:pointer;

    box-shadow:0 8px 20px rgba(0,0,0,.3);
}
```

---

# Selector

## 전체 선택

```css
* {
    margin:0;
    padding:0;
}
```

---

## :root

웹 문서 전체에서 사용할 CSS 변수를 저장하는 공간입니다.

```css
:root {

    --bg-dark:#1e1e1e;

    --bg-panel:#252526;

    --bg-tab:#2d2d2d;

    --border-color:#3c3c3c;

    --accent:#007acc;

    --text-main:#cccccc;

    --text-dim:#858585;

    --font-mono:'Consolas',
                'Courier New',
                monospace;
}
```

사용 예시

```css
body {

    background:var(--bg-dark);

    color:var(--text-main);

    font-family:var(--font-mono);
}
```

---

# 자주 쓰는 CSS 속성

```css
width:
height:

background:
background-color:

border:

color:

font-size:
font-weight:

padding:
margin:

display:

position:
top:
left:
right:
bottom:

border-radius:

box-shadow:

transform:

transition:
```

---

# 참고

* HTML : 웹 페이지 구조 담당
* CSS : 디자인 담당
* JavaScript : 동작 담당

HTML → 구조
CSS → 스타일
JavaScript → 기능
