# 05. 회귀분석 (Regression Analysis)

회귀분석(Regression Analysis)이란 하나 또는 그 이상의 독립변수(원인)가 종속변수(결과)에 미치는 영향력을 분석하고, 이를 바탕으로 미래의 값을 예측하는 대표적인 통계 분석 방법이다.

---

# 1. 단순 선형회귀분석 (Simple Linear Regression)

## 1) 개념

하나의 독립변수(X)와 하나의 종속변수(Y) 간의 선형적 관계를 분석하는 기법으로, **"원인이 단 하나일 때 결과가 어떻게 변하는가?"** 를 추적하는 분석 방법이다.

## 2) 직관적 예시

* 공부 시간(X)에 따른 시험 점수(Y) 예측
* 아파트 평수(X)에 따른 매매 가격(Y) 예측

---

## 3) 파이썬 실습: 공부시간에 따른 시험 점수 예측

### (1) 데이터 로드 및 확인

공부시간과 시험점수가 기록된 CSV 데이터를 불러온다.

```python
# 컴퓨터에서 작업하려면 아래 코드를 실행

import pandas as pd

study = pd.read_csv(
    '../머신러닝실습용자료/공부시간과시험점수.csv',
    encoding='cp949'
)

study
```

### 변수 설명

| 변수   | 설명               |
| ---- | ---------------- |
| 이름   | 의미 없는 식별값        |
| 공부시간 | Feature (독립변수 X) |
| 시험점수 | Target (종속변수 Y)  |

---

### (2) 데이터 시각화 (산점도)

데이터의 경향성을 확인하기 위해 산점도를 그린다.

```python
import matplotlib.pyplot as plt

data = study['공부시간']
target = study['시험점수']

plt.plot(data, target, 'o')
plt.show()
```

#### 해석

공부시간이 증가할수록 시험점수도 증가하는 우상향 경향을 확인할 수 있다.

---

### (3) 데이터 분할 및 차원 변형 (Reshape)

머신러닝 모델 학습을 위해 데이터를 훈련용과 테스트용으로 분리하고, 입력 데이터를 2차원 형태로 변환한다.

```python
import numpy as np
from sklearn.model_selection import train_test_split

# numpy 배열 변환
data = study['공부시간'].to_numpy()
target = study['시험점수'].to_numpy()

# 훈련용 / 테스트용 분리
훈련용_data, 테스트용_data, 훈련용_target, 테스트용_target = train_test_split(
    data,
    target,
    test_size=0.2,
    random_state=40
)

# shape 확인
print(훈련용_data.shape)
```

#### 실행 결과

```text
(20,)
```

현재는 1차원 배열이다.

---

### 1차원 → 2차원 변환

Scikit-Learn은 입력 데이터를 반드시 2차원 형태로 받는다.

```python
훈련용_data = 훈련용_data.reshape(-1, 1)
테스트용_data = 테스트용_data.reshape(-1, 1)

print(훈련용_data.shape)
```

#### 실행 결과

```text
(20, 1)
```

---

### (4) 선형회귀 모델 학습

`LinearRegression` 모델을 생성하고 학습한다.

```python
from sklearn.linear_model import LinearRegression

lr = LinearRegression()

lr.fit(훈련용_data, 훈련용_target)

print("훈련 점수 :", lr.score(훈련용_data, 훈련용_target))
print("테스트 점수 :", lr.score(테스트용_data, 테스트용_target))
```

#### 실행 결과

```text
훈련 점수 : 0.8869114576908868
테스트 점수 : 0.83676625848856
```

### 해석

* 훈련 데이터 설명력: 약 88.69%
* 테스트 데이터 설명력: 약 83.68%

모델이 비교적 안정적으로 학습되었음을 확인할 수 있다.

---

### (5) 예측하기

16시간 공부했을 때 예상 점수를 예측한다.

```python
lr.predict([[16]])
```

#### 실행 결과

```python
array([90.12423029])
```

따라서 16시간 공부하면 약 **90.12점**으로 예측된다.

---

### (6) 회귀계수 확인

기울기와 절편을 확인한다.

```python
print(lr.coef_)
print(lr.intercept_)
```

#### 실행 결과

```text
[1.80042161]
61.31748460585439
```

### 회귀식

[
Y = 61.3175 + 1.8004X
]

#### 해석

* 공부를 전혀 하지 않아도 기본 점수는 약 61.32점
* 공부시간이 1시간 증가할 때마다 점수는 약 1.80점 증가

---

### (7) 회귀선 시각화

```python
import matplotlib.pyplot as plt

plt.scatter(훈련용_data, 훈련용_target)

plt.plot(
    [5, 18],
    [
        5 * lr.coef_[0] + lr.intercept_,
        18 * lr.coef_[0] + lr.intercept_
    ]
)

plt.scatter(
    16,
    90,
    marker="^",
    color="red"
)

plt.show()
```

---

# 2. 다항회귀분석 (Polynomial Regression)

현실의 데이터는 항상 직선 형태가 아니므로, 곡선 형태를 표현하기 위해 다항식을 적용할 수 있다.

---

## (1) 다항 특성 생성

독립변수 X에 대해 (X^2) 항을 추가한다.

```python
import numpy as np

훈련용_data_poly = np.column_stack(
    (훈련용_data ** 2, 훈련용_data)
)

테스트용_data_poly = np.column_stack(
    (테스트용_data ** 2, 테스트용_data)
)
```

---

## (2) 다항회귀 모델 학습

```python
from sklearn.linear_model import LinearRegression

lr = LinearRegression()

lr.fit(
    훈련용_data_poly,
    훈련용_target
)

lr.score(
    테스트용_data_poly,
    테스트용_target
)
```

### 실행 결과

```text
0.5052713132458201
```

---

## (3) 16시간 공부 시 예측

```python
lr.predict([[16**2, 16]])
```

### 실행 결과

```python
array([85.24161226])
```

---

## (4) 훈련/테스트 점수 확인

```python
print(
    lr.score(
        훈련용_data_poly,
        훈련용_target
    )
)

print(
    lr.score(
        테스트용_data_poly,
        테스트용_target
    )
)
```

### 실행 결과

```text
0.9686934811074568
0.5052713132458201
```

---

## 과대적합(Overfitting) 해석

| 구분     | 단순회귀   | 다항회귀   |
| ------ | ------ | ------ |
| 훈련 점수  | 0.8869 | 0.9687 |
| 테스트 점수 | 0.8368 | 0.5053 |

다항회귀는 훈련 데이터에서는 매우 높은 성능을 보이지만 테스트 데이터 성능이 크게 하락하였다.

이는 모델이 훈련 데이터의 노이즈까지 학습한 **과대적합(Overfitting)** 현상이 발생했기 때문이다.

### 핵심 교훈

* 모델이 복잡해질수록 훈련 성능은 좋아질 수 있다.
* 그러나 테스트 성능이 감소하면 일반화 성능이 떨어진 것이다.
* 높은 정확도보다 **새로운 데이터를 잘 예측하는 모델**이 중요하다.
