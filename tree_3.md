# K-Means 군집분석 실습

## 1. 로컬 데이터 로드

```python
import pandas as pd

fruits = pd.read_csv('../머신러닝실습용자료/과일3개.csv', encoding='cp949')
fruits
```

종류	무게_g	길이_cm	당도
0	수박	2000	30.0	8.0
1	수박	2500	25.0	7.0
2	수박	1800	20.0	6.5
3	수박	1500	16.0	8.5
4	수박	2200	21.0	9.5
5	자두	100	3.5	6.0
6	자두	120	3.7	7.0
7	자두	90	2.8	8.0
8	자두	150	3.8	8.5
9	자두	110	3.6	7.5
10	참외	500	8.0	8.0
11	참외	400	7.5	7.2
12	참외	450	8.0	7.5
13	참외	400	6.5	6.5
14	참외	600	8.5	8.0
---

## 2. 데이터 분포 시각화 및 초기 중심점 지정

```python
import matplotlib.pyplot as plt

x1, y1 = 2000, 22
x2, y2 = 200, 2.5
x3, y3 = 500, 10

data = fruits[['무게_g', '길이_cm']]

plt.figure(figsize=(7,5))
plt.title("Before", fontsize=15)

plt.plot(data["무게_g"], data["길이_cm"], "o", label="Data")
plt.plot(
    [x1, x2, x3],
    [y1, y2, y3],
    "rD",
    marker='*',
    markersize=12,
    label='init_Centroid'
)

plt.xlabel("Weight", fontsize=12)
plt.ylabel("Length", fontsize=12)
plt.legend()
plt.grid()
plt.show()
```

---

## 3. K-Means 군집 분석 수행

```python
from sklearn.cluster import KMeans
import numpy as np

# 군집 분석은 비지도 학습이므로 target이 없음
data = fruits[['무게_g', '길이_cm']]

# 초기 중심점 지정
kmeans = KMeans(
    n_clusters=3,
    init=np.array([
        (x1, y1),
        (x2, y2),
        (x3, y3)
    ]),
    n_init=1
)

# 초기 중심점을 지정하지 않는 경우
# kmeans = KMeans(n_clusters=3)

# 모델 학습
kmeans.fit(data)

# 군집 라벨 및 최종 중심점
data['cluster'] = kmeans.labels_
final_centroid = kmeans.cluster_centers_

data
```

무게_g	길이_cm	cluster
0	2000	30.0	0
1	2500	25.0	0
2	1800	20.0	0
3	1500	16.0	0
4	2200	21.0	0
5	100	3.5	1
6	120	3.7	1
7	90	2.8	1
8	150	3.8	1
9	110	3.6	1
10	500	8.0	2
11	400	7.5	2
12	450	8.0	2
13	400	6.5	2
14	600	8.5	2

---

## 4. 군집화 결과 시각화

```python
plt.figure(figsize=(7,5))
plt.title("After", fontsize=15)

plt.scatter(
    data['무게_g'],
    data['길이_cm'],
    c=data['cluster']
)

plt.plot(
    final_centroid[:,0],
    final_centroid[:,1],
    "rD",
    marker='*',
    markersize=12,
    label='final_Centroid'
)

plt.xlabel("Weight", fontsize=12)
plt.ylabel("Length", fontsize=12)
plt.legend()
plt.grid()
plt.show()
```

---

## 5. 라벨 출력

### 각 데이터의 군집 라벨 확인

```python
kmeans.labels_
```

### 실행 결과

```python
[0 0 0 0 0 1 1 1 1 1 2 2 2 2 2]
```

---

## 6. 새로운 데이터 예측

### `[500, 20]` 데이터의 군집 예측

```python
kmeans.predict([[500, 20]])
```

### 결과

```python
array([2], dtype=int32)
```

### `[1700, 15]` 데이터의 군집 예측

```python
kmeans.predict([[1700, 15]])
```

### 결과

```python
array([0], dtype=int32)
```

---

## 7. Inertia 확인

클러스터 중심과 클러스터에 속한 샘플 사이 거리의 제곱합(SSE)을 확인한다.

```python
print(kmeans.inertia_)
```

### 결과

```python
610236.1279999999
```

---

## 8. 최적의 군집 개수 찾기 (Elbow Method)

```python
import matplotlib.pyplot as plt

inertia = []

for i in range(2, 15):
    km = KMeans(n_clusters=i)
    km.fit(data[['무게_g', '길이_cm']])
    inertia.append(km.inertia_)

plt.plot(range(2, 15), inertia)
plt.xlabel("Number of Clusters (k)")
plt.ylabel("Inertia")
plt.title("Elbow Method")
plt.grid()
plt.show()
```

---

## 실습 내용 요약

* K-Means 알고리즘을 이용하여 과일 데이터를 3개의 군집으로 분류하였다.
* 초기 중심점을 직접 지정하여 군집화를 수행하였다.
* 각 데이터의 군집 라벨을 확인하였다.
* 새로운 데이터에 대한 군집을 예측하였다.
* Inertia 값을 통해 군집화 성능을 확인하였다.
* Elbow Method를 이용하여 적절한 군집 수를 탐색하였다.

```
```
