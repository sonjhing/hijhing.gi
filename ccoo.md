# C언어 수업 정리 (03/24 ~ 06/09)

## 기본 시작 코드

### 예제 코드

```c
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int main()
{
    
}
```

### 설명

* `#define _CRT_SECURE_NO_WARNINGS`

  * Visual Studio에서 `scanf()` 사용 시 경고 제거
* `#include <stdio.h>`

  * 입출력 함수 사용 (`printf`, `scanf`)
* `main()`

  * 프로그램 시작 함수

---

# 03/24

## 증감 연산자

### 예제 코드

```c
#include <stdio.h>

int main()
{
    int a = 3;
    int b = 5;

    a++;

    printf("a = %d b = %d\n", a++, b++);
}
```

### 설명

* `a++`

  * 현재 값 사용 후 1 증가
* `++a`

  * 먼저 1 증가 후 사용

---

## 화폐 단위 계산 (127670원)

### 예제 코드

```c
#include<stdio.h>

int main()
{
    int money = 127670;

    int m50000 = money / 50000;
    int m10000 = (money % 50000) / 10000;
    int m5000  = (money % 10000) / 5000;
    int m1000  = (money % 5000) / 1000;
    int m500   = (money % 1000) / 500;
    int m100   = (money % 500) / 100;
    int m50    = (money % 100) / 50;
    int m10    = (money % 50) / 10;

    printf("%d %d %d %d %d %d %d %d",
        m50000,m10000,m5000,m1000,
        m500,m100,m50,m10);
}
```

### 설명

* `/` : 몫
* `%` : 나머지
* 큰 화폐 단위부터 차례대로 계산

---

## 두 정수 사칙연산

### 예제 코드

```c
#define _CRT_SECURE_NO_WARNINGS
#include<stdio.h>

int main()
{
    int a,b;

    printf("두 정수를 입력하세요.\n");
    scanf("%d %d",&a,&b);

    printf("더하기 : %d\n", a+b);
    printf("빼기 : %d\n", a-b);
    printf("곱하기 : %d\n", a*b);
    printf("나누기 : %d\n", a/b);
}
```

---

## 생산장비 사용시간 계산

### 문제

초 단위를 입력받아 시간과 분 출력

### 예제 코드

```c
int a;

scanf("%d",&a);

int hour = a / 3600;
int min = (a % 3600) / 60;

printf("%d시간 %d분",hour,min);
```

### 설명

* 1시간 = 3600초
* 나머지를 이용해 분 계산

---

## 삼항 연산자

### 예제 코드

```c
printf("%s", a <= 18 ? "미성년자" : "성인");
```

### 설명

```c
조건 ? 참일때 : 거짓일때
```

예시

```c
a <= 18 ? "미성년자" : "성인"
```

---

# 03/31

## 논리 연산자

### NOT

```c
!
```

### AND

```c
&&
```

두 조건 모두 참

### OR

```c
||
```

둘 중 하나만 참

---

## 복합 대입 연산자

### 예제 코드

```c
a += b;
```

### 설명

```c
a = a + b;
```

와 동일

---

## sizeof 연산자

### 예제 코드

```c
printf("%d", sizeof(int));
```

### 설명

자료형의 메모리 크기 확인

| 자료형    | 크기 |
| ------ | -- |
| char   | 1  |
| int    | 4  |
| float  | 4  |
| double | 8  |

---

# if 문

## 기본 형태

```c
if(조건)
{
    실행문;
}
```

---

## 양수 음수 0 판별

### 예제 코드

```c
if(a > 0)
    printf("양수");
else if(a < 0)
    printf("음수");
else
    printf("0");
```

---

## 두 수 차이 출력

### 예제 코드

```c
if(a > b)
    ans = a - b;
else
    ans = b - a;
```

---

## 세 정수 중 최대값

### 예제 코드

```c
if(a > b)
{
    if(a > c)
        printf("%d",a);
    else
        printf("%d",c);
}
else
{
    if(b > c)
        printf("%d",b);
    else
        printf("%d",c);
}
```

---

# switch 문

## 기본 형태

```c
switch(변수)
{
case 값:
    실행문;
    break;

default:
    실행문;
}
```

### 설명

* 경우의 수가 많을 때 사용
* `break` 만나면 탈출

---

# 반복문

## for 문

### 기본 형태

```c
for(초기식; 조건식; 증감식)
{
    실행문;
}
```

---

## 1~10 출력

### 예제 코드

```c
for(int i=1;i<=10;i++)
{
    printf("%d\n",i);
}
```

---

## 50~100 사이 5의 배수

### 예제 코드

```c
for(int i=50;i<=100;i++)
{
    if(i%5==0)
        printf("%d\n",i);
}
```

---

## 1~100 합계

### 예제 코드

```c
int sum=0;

for(int i=1;i<=100;i++)
{
    sum += i;
}
```

---

## 구구단

### 예제 코드

```c
int n;

scanf("%d",&n);

for(int i=1;i<=9;i++)
{
    printf("%d * %d = %d\n",
        n,i,n*i);
}
```

---

# while 문

## 기본 형태

```c
while(조건)
{
    실행문;
}
```

### 설명

```c
for(;조건;)
```

과 비슷

---

# 배열

## 선언

### 예제 코드

```c
int arr[5];
```

### 설명

* 인덱스는 0부터 시작
* 5개 저장 가능

```text
arr[0]
arr[1]
arr[2]
arr[3]
arr[4]
```

---

## 배열 크기 구하기

### 예제 코드

```c
int size = sizeof(arr);
int length = sizeof(arr)/sizeof(arr[0]);
```

---

## 배열 출력

### 예제 코드

```c
int arr[] = {1,2,3,4,5};

for(int i=0;i<5;i++)
{
    printf("%d\n",arr[i]);
}
```

---

# 문자열

## 문자열 선언

### 예제 코드

```c
char name[] = "Korea";
```

### 설명

문자열 끝에는 NULL 문자(`\0`)가 자동 저장됨

---

## 문자 출력

### 예제 코드

```c
printf("%c", name[i]);
```

---

## 문자열 출력

### 예제 코드

```c
printf("%s", name);
```

---

# 배열 응용 문제

## 최대값 찾기

### 예제 코드

```c
int num[9]={3,6,4,2,8,4,9,1,7};

int max = num[0];

for(int i=1;i<9;i++)
{
    if(max < num[i])
        max = num[i];
}
```

---

## 특정 값 찾기

### 예제 코드

```c
for(int i=0;i<9;i++)
{
    if(num[i] == target)
    {
        printf("%d번째", i);
        break;
    }
}
```

---

# 05/26 함수

## 함수 예제

### 예제 코드

```c
void add()
{
    int a,b;

    scanf("%d %d",&a,&b);

    printf("%d\n", a+b);
}
```

### 설명

* 함수는 특정 기능을 수행
* 코드 재사용 가능

---

# 06/09 포인터

## 포인터 개념

### 설명

| 기호 | 의미         |
| -- | ---------- |
| &  | 변수 주소      |
| *  | 주소가 가리키는 값 |

---

## 포인터 예제

### 예제 코드

```c
int a = 10;

int *p = &a;

printf("%d\n", *p);
```

### 결과

```text
10
```

---

# 선택 정렬

### 문제

```
6 8 2 9 4 7
```

오름차순 정렬

### 예제 코드

```c
for(int i=0;i<5;i++)
{
    int min=i;

    for(int j=i+1;j<6;j++)
    {
        if(arr[min] > arr[j])
            min=j;
    }

    int temp=arr[i];
    arr[i]=arr[min];
    arr[min]=temp;
}
```

### 결과

```text
2 4 6 7 8 9
```

---

# 시험 전 핵심 암기

1. `scanf()` → 변수 앞에 `&`
2. 배열 인덱스는 `0`부터 시작
3. 문자열 끝에는 `\0`
4. `/`는 몫, `%`는 나머지
5. `if`는 참/거짓
6. `switch`는 선택지가 많을 때
7. `for`, `while` 반복문 필수
8. `sizeof()` 크기 확인
9. 함수 = 기능 분리
10. 포인터

    * `&` 주소
    * `*` 주소의 값