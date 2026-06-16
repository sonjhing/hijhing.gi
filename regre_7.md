# 07. KNN 분류 - 수박과 참외 맞추기

KNN(K-Nearest Neighbors, K-최근접 이웃 알고리즘)은 새로운 데이터가 들어왔을 때 가장 가까운 K개의 이웃 데이터를 참고하여 분류하는 머신러닝 알고리즘이다.

---

# Step 1. 한글 폰트 설정 (Google Colab)

```python
!sudo apt-get install -y fonts-nanum
!sudo fc-cache -fv
!rm ~/.cache/matplotlib -rf
```

---

# Step 2. 데이터 불러오기

수박과 참외의 무게와 길이 정보를 담은 CSV 파일을 불러온다.

```python
import pandas as pd

# 컴퓨터에서 작업하려면 아래 코드를 실행
src_data = pd.read_csv(
    'C:/Users/user/Desktop/내꺼다/4 목/회귀, 분류/머신러닝실습용자료/수박과참외.csv',
    encoding='cp949'
)

src_data
```

### 데이터 예시

| 종류  | 무게   | 길이   |
| --- | ---- | ---- |
| 수박  | 2000 | 30.0 |
| 수박  | 2500 | 25.0 |
| 수박  | 1800 | 20.0 |
| ... | ...  | ...  |
| 참외  | 400  | 4.5  |
| 참외  | 600  | 8.5  |

---

# Step 3. 데이터 시각화

수박과 참외를 산점도로 확인한다.

```python
수박정보 = src_data.loc[
    src_data['종류'] == '수박',
    ['무게', '길이']
]

참외정보 = src_data.loc[
    src_data['종류'] == '참외',
    ['무게', '길이']
]

import matplotlib.pyplot as plt

plt.scatter(
    수박정보['무게'],
    수박정보['길이'],
    label='수박'
)

plt.scatter(
    참외정보['무게'],
    참외정보['길이'],
    label='참외'
)

plt.xlabel('Weight')
plt.ylabel('Length')
plt.legend()
plt.show()
```

### 해석

* 수박은 무게와 길이가 크다.
* 참외는 무게와 길이가 작다.
* 두 그룹이 비교적 명확하게 구분된다.

---

# Step 4. Feature와 Target 생성

머신러닝 학습에 사용할 입력값(X)과 정답(Y)을 생성한다.

```python
import numpy as np

# 입력 데이터 (무게, 길이)
data = np.column_stack(
    (
        src_data['무게'],
        src_data['길이']
    )
)

# 정답 데이터
target = src_data['종류']

print(data[:5])
print(target[:5])
```

### 설명

* data → 무게, 길이
* target → 수박 또는 참외

---

# Step 5. 훈련용 / 테스트용 데이터 분리

```python
from sklearn.model_selection import train_test_split

훈련용_data, 테스트용_data, 훈련용_target, 테스트용_target = train_test_split(
    data,
    target,
    test_size=0.25,
    random_state=40
)

print("훈련 데이터:", 훈련용_data.shape)
print("테스트 데이터:", 테스트용_data.shape)
```

### 실행 결과

```text
훈련 데이터: (11, 2)
테스트 데이터: (4, 2)
```

---

# Step 6. KNN 모델 생성 및 학습

```python
from sklearn.neighbors import KNeighborsClassifier

# K = 3
knn = KNeighborsClassifier(n_neighbors=3)

# 모델 학습
knn.fit(
    훈련용_data,
    훈련용_target
)

# 모델 평가
print(
    "정확도:",
    knn.score(
        테스트용_data,
        테스트용_target
    )
)
```

---

# Step 7. 새로운 데이터 예측

무게가 1000g이고 길이가 15cm인 과일을 예측한다.

```python
print(
    knn.predict(
        [[1000, 15]]
    )
)
```

### 실행 결과

```text
['수박']
```

### 해석

KNN 모델은 해당 데이터를 **수박**으로 분류하였다.

---

# Step 8. 예측 결과 시각화

```python
import matplotlib.pyplot as plt

plt.rc('font', family='NanumBarunGothic')

plt.scatter(
    훈련용_data[:, 0],
    훈련용_data[:, 1]
)

plt.scatter(
    1000,
    15,
    marker='o',
    color='red'
)

plt.xlabel('무게')
plt.ylabel('길이')
plt.show()
```

---

# Step 9. 최적의 K 값 찾기

K 값에 따라 정확도가 달라질 수 있으므로 여러 값을 테스트한다.

```python
import matplotlib.pyplot as plt
from sklearn.neighbors import KNeighborsClassifier

k_list = range(1, 12)

accuracies = []

for k in k_list:

    classifier = KNeighborsClassifier(
        n_neighbors=k
    )

    classifier.fit(
        훈련용_data,
        훈련용_target
    )

    accuracies.append(
        classifier.score(
            테스트용_data,
            테스트용_target
        )
    )

plt.plot(
    k_list,
    accuracies
)

plt.xlabel("K")
plt.ylabel("Validation Accuracy")
plt.title("최적의 K 값 찾기")

plt.show()
```

### 해석

그래프에서 정확도가 가장 높은 K 값을 선택한다.

---

# Step 10. 최적의 K 값으로 재학습

```python
knn = KNeighborsClassifier(
    n_neighbors=3
)

knn.fit(
    훈련용_data,
    훈련용_target
)

print(
    knn.score(
        테스트용_data,
        테스트용_target
    )
)

print(
    knn.predict(
        [[1000, 15]]
    )
)
```

### 실행 결과

```text
1.0
['수박']
```

---

# Step 11. 모델 저장하기

학습된 모델을 파일로 저장한다.

```python
import joblib

model = knn.fit(
    훈련용_data,
    훈련용_target
)

joblib.dump(
    model,
    "knn_model.pkl"
)
```

### 실행 결과

```text
['knn_model.pkl']
```

---

# Step 12. 저장된 모델 불러오기

저장한 모델을 다시 불러와 예측할 수 있다.

```python
import joblib

kn2 = joblib.load(
    'knn_model.pkl'
)

print(
    kn2.predict(
        [[800, 8]]
    )
)
```

### 실행 결과

```text
['참외']
```

---

# KNN 핵심 정리

## KNN(K-Nearest Neighbors)

* 새로운 데이터와 가장 가까운 K개의 데이터를 찾는다.
* 다수결 방식으로 분류를 수행한다.
* 학습 과정이 거의 없고 구현이 쉽다.

## 장점

* 이해하기 쉽다.
* 구현이 간단하다.
* 비선형 데이터도 처리 가능하다.

## 단점

* 데이터가 많아질수록 속도가 느려진다.
* K 값 선택에 따라 성능이 크게 달라진다.
* 특성(Feature)의 스케일 차이에 민감하다.

## 본 실습 결과

| 입력 데이터        | 예측 결과 |
| ------------- | ----- |
| (1000g, 15cm) | 수박    |
| (800g, 8cm)   | 참외    |

KNN 알고리즘을 이용하여 무게와 길이만으로도 수박과 참외를 높은 정확도로 구분할 수 있었다.
