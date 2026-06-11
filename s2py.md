# Python 기초 정리

---

# 01. 파이썬(Python)이란?

1991년 네덜란드의 귀도 반 로섬(Guido van Rossum)이 개발한 인터프리터 언어입니다.

## 인터프리터 언어란?

소스 코드를 한 줄씩 해석하며 바로 실행하는 언어입니다.

### 특징

* 문법이 간단함
* 유지보수가 쉬움
* 다양한 분야에서 사용
* 실행 결과를 바로 확인 가능

---

# 02. 자료형과 변수

## 변수(Variable)

값을 저장하는 메모리 공간입니다.

```python
name = "python"
age = 20
```

---

# 02-1. 숫자형(Number)

| 종류    | 설명   | 예시         |
| ----- | ---- | ---------- |
| int   | 정수   | 1, -3, 0   |
| float | 실수   | 3.14, -1.5 |
| oct   | 8진수  | 0o34       |
| hex   | 16진수 | 0xFF       |

## 연산자

| 연산  | 기호 |
| --- | -- |
| 덧셈  | +  |
| 뺄셈  | -  |
| 곱셈  | *  |
| 나눗셈 | /  |
| 제곱  | ** |
| 나머지 | %  |
| 몫   | // |

```python
a = 10
b = 3

print(a + b)
print(a // b)
print(a % b)
```

---

# 02-2. 문자열(String)

문자의 집합입니다.

```python
text = "Hello"
```

## 문자열 생성

```python
"a"
'a'
"""abc"""
'''abc'''
```

## 이스케이프 문자

| 문자 | 의미    |
| -- | ----- |
| \n | 줄바꿈   |
| \t | 탭     |
| \  | 백슬래시  |
| '  | 작은따옴표 |
| "  | 큰따옴표  |

## 문자열 기능

```python
a = "Python"

print(len(a))
print(a[0])
print(a[0:3])
```

## 문자열 메서드

| 함수        | 설명      |
| --------- | ------- |
| upper()   | 대문자 변환  |
| lower()   | 소문자 변환  |
| split()   | 문자열 나누기 |
| replace() | 문자열 변경  |
| strip()   | 공백 제거   |

```python
text = " hello "

print(text.strip())
print(text.upper())
```

---

# 02-3. 리스트(List)

순서가 있고 수정 가능한 자료형입니다.

```python
a = [1, 2, 3]
```

## 주요 함수

| 함수        | 설명   |
| --------- | ---- |
| append()  | 값 추가 |
| sort()    | 정렬   |
| reverse() | 뒤집기  |
| insert()  | 삽입   |
| remove()  | 삭제   |
| pop()     | 꺼내기  |

```python
a.append(4)
a.remove(2)
```

---

# 02-4. 튜플(Tuple)

수정 불가능한 자료형입니다.

```python
a = (1, 2, 3)
```

## 특징

* 순서 있음
* 수정 불가
* 속도가 빠름

---

# 02-5. 딕셔너리(Dictionary)

Key와 Value 형태로 저장합니다.

```python
person = {
    "name": "kim",
    "age": 20
}
```

## 주요 함수

| 함수       | 설명       |
| -------- | -------- |
| keys()   | key 조회   |
| values() | value 조회 |
| items()  | 전체 조회    |
| get()    | 값 가져오기   |

---

# 02-6. 집합(Set)

중복을 허용하지 않는 자료형입니다.

```python
s = {1, 2, 3}
```

## 특징

* 중복 제거
* 순서 없음

## 집합 연산

```python
a & b
a | b
a - b
```

---

# 02-7. 불(Boolean)

참(True) / 거짓(False)

```python
True
False
```

## False로 취급되는 값

```python
0
""
[]
{}
None
```

---

# 03. 조건문(if)

조건에 따라 코드를 실행합니다.

```python
score = 90

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")
```

## 비교 연산자

| 연산자 | 의미  |
| --- | --- |
| ==  | 같다  |
| !=  | 다르다 |
| >   | 크다  |
| <   | 작다  |

---

# 03-2. while 반복문

조건이 참인 동안 반복합니다.

```python
num = 1

while num <= 5:
    print(num)
    num += 1
```

## 반복 제어

| 명령어      | 설명    |
| -------- | ----- |
| break    | 반복 종료 |
| continue | 다음 반복 |

---

# 03-3. for 반복문

리스트나 문자열 등을 반복합니다.

```python
for i in [1, 2, 3]:
    print(i)
```

## range()

```python
for i in range(1, 6):
    print(i)
```

---

# 04. 함수(Function)

특정 기능을 묶어 재사용합니다.

```python
def add(a, b):
    return a + b
```

## 함수 호출

```python
result = add(10, 20)
print(result)
```

## 매개변수와 인수

| 종류              | 설명       |
| --------------- | -------- |
| 매개변수(Parameter) | 함수 내부 변수 |
| 인수(Argument)    | 실제 전달 값  |

---

# lambda 함수

한 줄 함수입니다.

```python
add = lambda a, b: a + b
```

---

# 사용자 입력과 출력

## 입력(input)

```python
name = input("이름 입력: ")
```

## 출력(print)

```python
print("Hello")
```

---

# 05. 모듈(Module)

기능을 파일 단위로 분리한 것입니다.

```python
import math
```

## 특정 함수만 가져오기

```python
from math import sqrt
```

---

# 06. 패키지(Package)

모듈을 폴더 단위로 관리하는 구조입니다.

```python
mypackage/
    test.py
```

---

# 핵심 정리

| 자료형        | 특징           |
| ---------- | ------------ |
| List       | 수정 가능        |
| Tuple      | 수정 불가        |
| Dictionary | Key-Value    |
| Set        | 중복 제거        |
| Boolean    | True / False |
    