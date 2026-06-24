# 07. KNN 분류 - 수박과 참외 맞추기

**KNN(K-Nearest Neighbors, K-최근접 이웃 알고리즘)**은 새로운 데이터가 주어졌을 때 기존 데이터 중 가장 가까운 K개의 이웃 데이터를 확인하고, 그 이웃들이 가장 많이 속한 그룹(다수결)으로 새로운 데이터를 분류하는 직관적인 머신러닝 알고리즘입니다.

---

# Step 1. 한글 폰트 설정 (Google Colab)

그래프를 그릴 때 한글이 깨지는 현상을 방지하기 위해 폰트를 설치하고 캐시를 삭제하는 과정입니다.

```python
# 나눔 폰트를 설치합니다.
!sudo apt-get install -y fonts-nanum
# 설치된 폰트를 시스템에 적용하기 위해 폰트 캐시를 갱신합니다.
!sudo fc-cache -fv
# matplotlib이 이전 폰트 캐시를 사용하지 않도록 기존 캐시 폴더를 삭제합니다.
!rm ~/.cache/matplotlib -rf
```

---

# Step 2. 데이터 불러오기

수박과 참외의 '무게'와 '길이' 정보를 담은 CSV 파일을 판다스(Pandas)를 이용하여 불러옵니다.

```python
import pandas as pd

# 컴퓨터(로컬)에서 작업할 때 파일을 불러오는 코드입니다.
# 파일 경로와 인코딩 방식을 지정해줍니다. (cp949는 한글 윈도우 기본 인코딩)
src_data = pd.read_csv(
    'C:/Users/user/Desktop/내꺼다/4 목/회귀, 분류/머신러닝실습용자료/수박과참외.csv',
    encoding='cp949'
)

# 데이터를 화면에 출력하여 확인합니다.
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

가져온 데이터를 바탕으로 수박과 참외가 무게와 길이에 따라 어떻게 분포되어 있는지 산점도(Scatter Plot)로 그려서 확인합니다.

```python
# '종류'가 '수박'인 데이터만 골라서 '무게'와 '길이' 열만 가져옵니다.
수박정보 = src_data.loc[
    src_data['종류'] == '수박',
    ['무게', '길이']
]

# '종류'가 '참외'인 데이터만 골라서 '무게'와 '길이' 열만 가져옵니다.
참외정보 = src_data.loc[
    src_data['종류'] == '참외',
    ['무게', '길이']
]

import matplotlib.pyplot as plt

# 수박의 무게를 X축, 길이를 Y축으로 하는 산점도를 그립니다.
plt.scatter(
    수박정보['무게'],
    수박정보['길이'],
    label='수박' # 범례에 표시할 이름
)

# 참외의 무게를 X축, 길이를 Y축으로 하는 산점도를 그립니다.
plt.scatter(
    참외정보['무게'],
    참외정보['길이'],
    label='참외' # 범례에 표시할 이름
)

# X축과 Y축의 라벨을 설정합니다.
plt.xlabel('Weight')
plt.ylabel('Length')

# 범례(label)를 화면에 표시합니다.
plt.legend()

# 그래프를 최종적으로 화면에 출력합니다.
plt.show()
```

### 해석

* 산점도를 보면 수박은 무게와 길이가 크고, 참외는 작게 나타납니다.
* 두 그룹(수박, 참외)이 섞이지 않고 비교적 명확하게 나뉘어 있는 것을 볼 수 있습니다. 분류하기 좋은 데이터입니다.

---

# Step 4. Feature와 Target 생성

머신러닝 모델을 학습시키기 위해서는 입력으로 사용할 특성 데이터(Feature, X)와 맞추고자 하는 정답 데이터(Target, Y)를 나누어주어야 합니다.

```python
import numpy as np

# column_stack을 사용하여 '무게' 데이터와 '길이' 데이터를 묶어 2차원 배열(입력 데이터)로 만듭니다.
data = np.column_stack(
    (
        src_data['무게'],
        src_data['길이']
    )
)

# 모델이 맞추어야 할 정답(수박인지 참외인지)을 저장합니다.
target = src_data['종류']

# 데이터가 잘 만들어졌는지 처음 5개만 확인해봅니다.
print(data[:5])
print(target[:5])
```

### 설명

* `data` → 입력 특징(Feature): 무게, 길이
* `target` → 정답(Target): 수박 또는 참외

---

# Step 5. 훈련용 / 테스트용 데이터 분리

가지고 있는 데이터를 전부 학습에 사용해버리면, 모델이 정답을 외운 것인지 진짜 잘 맞추는 것인지 평가할 수 없습니다. 따라서 데이터를 학습용과 시험용으로 나눕니다.

```python
from sklearn.model_selection import train_test_split

# train_test_split 함수를 사용하여 데이터를 훈련용(Train)과 테스트용(Test)으로 분리합니다.
# test_size=0.25는 전체 데이터의 25%를 테스트용으로 빼두겠다는 의미입니다.
# random_state=40은 섞을 때마다 같은 결과가 나오도록 시드를 고정하는 역할을 합니다.
훈련용_data, 테스트용_data, 훈련용_target, 테스트용_target = train_test_split(
    data,
    target,
    test_size=0.25,
    random_state=40
)

# 분리된 데이터의 크기(형태)를 확인합니다.
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

사이킷런(scikit-learn)을 이용해 KNN 알고리즘 모델을 만들고 훈련 데이터로 학습을 시킵니다.

```python
from sklearn.neighbors import KNeighborsClassifier

# 최근접 이웃의 수(K)를 3으로 설정하여 모델 객체를 생성합니다. (가장 가까운 3개의 이웃을 보고 판단)
knn = KNeighborsClassifier(n_neighbors=3)

# 훈련용 데이터를 이용하여 모델을 학습시킵니다.
knn.fit(
    훈련용_data,
    훈련용_target
)

# 학습이 끝난 모델에 테스트용 데이터를 넣어, 정답률(정확도)이 얼마나 되는지 평가합니다.
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

학습된 모델에 이전에 본 적 없는 완전히 새로운 데이터를 주고 무엇인지 예측해봅니다. (무게 1000g, 길이 15cm)

```python
# predict 함수를 사용하여 새로운 데이터의 종류를 예측합니다.
# 입력 형태가 2차원 배열이어야 하므로 괄호가 두 개 [[...]] 들어갑니다.
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

KNN 모델은 새로 입력된 무게 1000g, 길이 15cm의 과일이 기존의 데이터들을 참고했을 때 **수박**에 더 가깝다고 분류하였습니다.

---

# Step 8. 예측 결과 시각화

앞서 예측한 새로운 데이터가 실제로 어느 위치에 있는지 그래프를 통해 확인합니다.

```python
import matplotlib.pyplot as plt

# 그래프에 한글이 제대로 출력되도록 폰트를 설정합니다.
plt.rc('font', family='NanumBarunGothic')

# 기존 훈련용 데이터들의 분포를 파란 점으로 산점도를 그립니다.
# 훈련용_data[:, 0]은 무게(X축), 훈련용_data[:, 1]은 길이(Y축)를 나타냅니다.
plt.scatter(
    훈련용_data[:, 0],
    훈련용_data[:, 1]
)

# 새롭게 예측을 시도했던 데이터(1000g, 15cm)를 눈에 띄게 빨간색 'o' 마커로 표시합니다.
plt.scatter(
    1000,
    15,
    marker='o',
    color='red'
)

# 축 이름 설정 후 그래프를 보여줍니다.
plt.xlabel('무게')
plt.ylabel('길이')
plt.show()
```

---

# Step 9. 최적의 K 값 찾기

KNN에서 K(이웃의 수)를 몇 개로 하느냐에 따라 정확도가 달라질 수 있습니다. K값을 바꿔가며 가장 정확도가 높은 값을 찾아봅니다.

```python
import matplotlib.pyplot as plt
from sklearn.neighbors import KNeighborsClassifier

# 1부터 11까지의 K 값을 테스트하기 위해 범위를 지정합니다.
k_list = range(1, 12)

# 각 K 값에 대한 정확도를 저장할 빈 리스트를 만듭니다.
accuracies = []

# K값을 1부터 11까지 바꿔가며 반복문을 실행합니다.
for k in k_list:

    # K값을 변경하며 새로운 모델을 생성합니다.
    classifier = KNeighborsClassifier(
        n_neighbors=k
    )

    # 모델을 훈련시킵니다.
    classifier.fit(
        훈련용_data,
        훈련용_target
    )

    # 테스트 데이터로 정확도를 평가하고, 그 결과를 accuracies 리스트에 추가합니다.
    accuracies.append(
        classifier.score(
            테스트용_data,
            테스트용_target
        )
    )

# K값의 변화에 따른 정확도를 선 그래프(plot)로 시각화합니다.
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

그래프를 확인하여 정확도(Validation Accuracy)가 가장 높게 나타나는 K 값을 선택하는 것이 좋습니다.

---

# Step 10. 최적의 K 값으로 재학습

만약 찾은 최적의 K 값이 3이라고 가정하고, 해당 K값으로 모델을 만들어 최종적으로 학습시키고 확인하는 과정입니다.

```python
# 가장 성능이 좋다고 판단한 K=3으로 모델을 다시 생성합니다.
knn = KNeighborsClassifier(
    n_neighbors=3
)

# 모델 학습
knn.fit(
    훈련용_data,
    훈련용_target
)

# 최종 모델의 테스트 정확도 확인
print(
    knn.score(
        테스트용_data,
        테스트용_target
    )
)

# 새로운 데이터로 테스트
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

잘 학습된 모델을 매번 새로 학습시킬 필요 없이 파일로 저장해두면 나중에 다시 재사용할 수 있습니다.

```python
import joblib

# 모델 학습 결과를 model 변수에 담습니다.
model = knn.fit(
    훈련용_data,
    훈련용_target
)

# joblib 라이브러리의 dump 함수를 이용해 학습된 모델을 'knn_model.pkl' 이라는 이름의 파일로 저장합니다.
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

앞서 저장한 모델 파일을 불러와서 다시 새로운 데이터 예측에 바로 사용할 수 있습니다.

```python
import joblib

# 'knn_model.pkl' 파일에 저장된 모델을 불러와 kn2라는 변수에 할당합니다.
kn2 = joblib.load(
    'knn_model.pkl'
)

# 불러온 모델(kn2)을 사용하여 새로운 데이터(800g, 8cm)의 종류를 예측해 봅니다.
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

* **원리:** 새로운 데이터가 주어졌을 때 기존 데이터 중 가장 가까운 K개의 데이터를 찾습니다.
* **분류:** 찾아낸 K개의 이웃들이 가장 많이 속한 그룹을 다수결 방식으로 채택하여 새로운 데이터를 분류합니다.
* **특징:** 사실상 별도의 '학습' 단계가 없으며(데이터를 저장해두는 것이 전부), 새로운 데이터가 들어왔을 때 거리를 계산하여 판단합니다.

## 장점

* 직관적이고 이해하기 매우 쉽습니다.
* 코드로 구현하고 사용하기 간단합니다.
* 수식으로 훈련되는 것이 아니라 실제 이웃을 참조하므로, 복잡하고 비선형적인 분포를 가진 데이터도 잘 분류할 수 있습니다.

## 단점

* 새로운 데이터를 예측할 때마다 기존의 모든 데이터와의 거리를 계산해야 하므로, 데이터 양이 많아질수록 속도가 급격히 느려집니다.
* K 값을 몇으로 정하느냐에 따라 성능이 크게 달라지며, 적절한 K를 찾아야 합니다.
* 특성(Feature) 간 스케일(단위) 차이에 매우 민감합니다. (따라서 사용 전 데이터 표준화(Scaling)가 필수적인 경우가 많습니다.)

## 본 실습 결과 요약

| 입력 데이터        | 예측 결과 |
| ------------- | ----- |
| (1000g, 15cm) | 수박    |
| (800g, 8cm)   | 참외    |

단순히 과일의 '무게'와 '길이'라는 두 가지 특징(Feature)만으로도 KNN 알고리즘을 사용하여 수박과 참외를 매우 높은 정확도로 구분해 낼 수 있었습니다.
