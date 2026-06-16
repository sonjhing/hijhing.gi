# K-Means와 DBSCAN 군집분석 비교 실습

## 1. 테스트용 데이터 생성

`make_moons()` 함수를 사용하여 반달(Moon) 형태의 데이터를 생성한다.

```python
import matplotlib.pyplot as plt
from matplotlib import style
from sklearn.datasets import make_moons

X, y = make_moons(
    n_samples=400,
    noise=0.1,
    random_state=10
)

plt.scatter(X[:, 0], X[:, 1])
plt.show()
```

### 데이터 설명

* `n_samples=400` : 생성할 데이터 개수
* `noise=0.1` : 데이터에 추가되는 노이즈 정도
* `random_state=10` : 동일한 결과 재현을 위한 난수 시드

---

## 2. 군집 결과 시각화 함수 생성

군집화 결과를 시각적으로 확인하기 위한 함수를 정의한다.

```python
import matplotlib.pyplot as plt

def cluster_result(X, y, title):
    plt.scatter(
        X[y == 0, 0],
        X[y == 0, 1],
        c='green',
        marker='o',
        s=40,
        label='Cluster_1'
    )

    plt.scatter(
        X[y == 1, 0],
        X[y == 1, 1],
        c='red',
        marker='s',
        s=40,
        label='Cluster_2'
    )

    plt.title(title)
    plt.legend()
    plt.show()
```

### 함수 설명

* `X` : 입력 데이터
* `y` : 군집 라벨
* `title` : 그래프 제목

---

## 3. K-Means 클러스터링 수행

K-Means 알고리즘을 이용하여 데이터를 2개의 군집으로 분류한다.

```python
from sklearn.cluster import KMeans

# 모델 생성
km = KMeans(
    n_clusters=2,
    random_state=10
)

# 모델 학습 및 예측
y_km = km.fit_predict(X)

# 결과 시각화
cluster_result(
    X,
    y_km,
    title='K-Means'
)
```

### 주요 파라미터

* `n_clusters=2` : 군집 개수
* `random_state=10` : 결과 재현성 확보

### 특징

* 중심점(Centroid)을 기준으로 군집을 생성
* 원형 또는 구형 데이터에 적합
* 복잡한 형태의 데이터에서는 성능이 저하될 수 있음

---

## 4. DBSCAN 클러스터링 수행

DBSCAN 알고리즘을 이용하여 데이터를 군집화한다.

```python
from sklearn.cluster import DBSCAN

# 모델 생성
db = DBSCAN(
    eps=0.2,
    min_samples=15,
    metric='euclidean'
)

# 모델 학습 및 예측
y_db = db.fit_predict(X)

# 결과 시각화
cluster_result(
    X,
    y_db,
    title='DBSCAN'
)
```

### 주요 파라미터

* `eps=0.2`

  * 이웃으로 판단할 최대 거리

* `min_samples=15`

  * 군집을 형성하기 위한 최소 데이터 수

* `metric='euclidean'`

  * 거리 계산 방식 (유클리드 거리)

### 특징

* 데이터 밀도를 기반으로 군집 형성
* 군집 개수를 미리 지정할 필요 없음
* 이상치(Noise) 탐지 가능
* 비선형 구조의 데이터에 강함

---

## 5. 결과 비교

### K-Means 결과

* 중심점을 기준으로 군집을 형성
* 반달 모양 데이터의 구조를 정확하게 반영하지 못함
* 직선 경계로 군집을 분리

### DBSCAN 결과

* 밀도 기반 군집화 수행
* 반달 형태의 데이터 구조를 잘 반영
* 비선형 데이터에서도 우수한 성능

---

## 결론

| 항목              | K-Means | DBSCAN   |
| --------------- | ------- | -------- |
| 군집 개수 지정        | 필요      | 불필요      |
| 이상치 탐지          | 불가능     | 가능       |
| 계산 속도           | 빠름      | 상대적으로 느림 |
| 비선형 데이터         | 부적합     | 적합       |
| 반달(Moon) 데이터 성능 | 낮음      | 높음       |

### 실습 결과

반달(Moon) 형태 데이터에서는 K-Means보다 DBSCAN이 데이터의 실제 구조를 더 잘 반영하는 군집화를 수행한다.
