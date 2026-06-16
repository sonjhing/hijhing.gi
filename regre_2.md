
# 3. 다중회귀분석 (Multiple Linear Regression)

## 1) 개념


---

## 4) 파이썬 실습: 여러 원인을 반영한 시험 점수 예측

### (1) 데이터 로드 및 분할

```python

#컴퓨터에서 작업하려면 아래 코드의 주석을 제거하고 실행하면 됩니다
import pandas as pd
study = pd.read_csv('../머신러닝실습용자료/공부시간과시험점수2.csv',encoding='cp949')
study

# 다중 독립변수 지정
data = study[['공부시간', '학원수', '과외여부']]
target = study['시험점수']



# 훈련/테스트 세트 분리
훈련용_data, 테스트용_data, 훈련용_target, 테스트용_target = train_test_split
(data, target, test_size=0.2, random_state=40)
```

---
결과
array([84.86657458])


lr.score(테스트용_data , 테스트용_target)


### (2) 모델 학습 및 성능 검증

```python
from sklearn.linear_model import LinearRegression

# 모델 생성 및 학습
lr_multi = LinearRegression()
lr_multi.fit(훈련용_data, 훈련용_target)

# 결정계수 R2 점수 확인
print("다중회귀 훈련 세트 R2 점수 :", lr_multi.score(훈련용_data, 훈련용_target))
print("다중회귀 테스트 세트 R2 점수 :", lr_multi.score(테스트용_data, 테스트용_target))
```

#### 실행 결과

```text
다중회귀 훈련 세트 R2 점수 : 0.9326180323755402
다중회귀 테스트 세트 R2 점수 : 0.8967399286768529
```

단순 선형회귀보다 테스트 성능이 향상되어 여러 독립변수를 고려한 모델이 더 높은 설명력을 보인다.

---

### (3) 회귀계수 해석 및 예측

```python
print("회귀 계수(Coefficients):", lr_multi.coef_)
print("Y 절편(Intercept):", lr_multi.intercept_)

# 예측 실행
print(
    "공부시간 13시간, 학원 5개, 과외 X 학생의 예측 점수:",
    lr_multi.predict([[13, 5, 0]])
)
```

#### 실행 결과

```text
회귀 계수(Coefficients): [ 2.08625548 -0.22486821  0.31139414]
Y 절편(Intercept): 58.86959435570258

공부시간 13시간, 학원 5개, 과외 X 학생의 예측 점수:
[84.86657458]
```

#### 최종 다중 선형 회귀 방정식

[
Y =
58.8696
+
2.0863 \times 공부시간
------------------

0.2249 \times 학원수
+
0.3114 \times 과외여부
]

### 회귀계수 해석

* 공부시간이 1시간 증가 → 점수 약 2.09점 증가
* 학원수가 1개 증가 → 점수 약 0.22점 감소
* 과외를 받는 경우 → 점수 약 0.31점 증가

### 예측 결과

공부시간 13시간, 학원 5개, 과외 없음인 학생의 예상 점수는 약 **84.87점**이다.

---