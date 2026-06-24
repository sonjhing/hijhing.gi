# 인공지능프로그래밍기초 - 8. K-Fold 교차검증

## 📌 K-Fold 교차검증(Cross Validation)이란?

**K-Fold 교차검증**은 머신러닝 모델의 성능을 보다 객관적으로 평가하기 위해 전체 데이터를 여러 개(K개)의 부분 집합(Fold)으로 나누고, 돌아가면서 한 개의 부분 집합을 테스트용으로, 나머지(K-1개)를 훈련용으로 사용하여 모델을 검증하는 방법입니다.

- **예시 (5-Fold의 경우):** 데이터를 5개의 조각(1, 2, 3, 4, 5번)으로 나눕니다. 첫 번째 검증에서는 1번 조각을 테스트용, 2~5번을 훈련용으로 사용합니다. 두 번째 검증에서는 2번 조각을 테스트용, 나머지 1, 3, 4, 5번을 훈련용으로 사용합니다. 이 과정을 총 5번 반복하여 얻은 5개의 정확도를 평균 내어 모델의 최종 성능을 평가합니다.

## 🎯 K-Fold 교차검증은 언제 사용할까요?

1. **데이터 수가 부족할 때:** 훈련용과 테스트용 데이터를 딱 한 번만 나누게 되면, 우연히 테스트 데이터가 모델에 유리하게 뽑혀 성능이 과장되거나 반대로 낮게 나올 수 있습니다. K-Fold를 사용하면 모든 데이터가 최소 한 번씩 테스트에 사용되므로, 데이터가 적은 환경에서도 모델의 성능 평가를 신뢰할 수 있습니다.
2. **과적합(Overfitting)을 방지하고 싶을 때:** 특정 훈련 데이터에만 모델이 과하게 학습되는 과적합 현상을 예방하고, 완전히 새로운 데이터가 들어왔을 때 모델이 얼마나 잘 동작할지(일반화 성능)를 정확히 파악할 수 있습니다.
3. **여러 모델의 성능을 공정하게 비교할 때:** 서로 다른 머신러닝 알고리즘이나 설정값(하이퍼파라미터) 중 어떤 것이 가장 좋은지 선택할 때, 단일 테스트 결과보다 K-Fold 평균 결과가 훨씬 객관적인 기준이 됩니다.

---

## 💻 실습: 과일 종류 예측 모델 교차검증

수박과 참외의 무게, 길이 데이터를 사용하여 종류를 분류하는 모델(의사결정트리)을 만들고, 교차검증을 통해 실제 객관적인 성능이 어떻게 평가되는지 확인하는 실습입니다.

### Step 1. 데이터 불러오기

```python
import pandas as pd

# 컴퓨터(로컬)에서 작업할 때 csv 파일을 불러오는 코드입니다.
# '의사결정나무_과일종류_2가지.csv' 파일을 읽어옵니다. (cp949는 한글 인코딩용)
src_data = pd.read_csv('./머신러닝실습용자료/의사결정나무_과일종류_2가지.csv', encoding='cp949')

# 정상적으로 불러왔는지 데이터를 화면에 출력해 봅니다.
src_data
```

**[출력 결과]**
```text
	종류	무게	길이
0	수박	2000	30.0
1	수박	2500	25.0
2	수박	1800	20.0
3	수박	1500	16.0
4	수박	1900	19.0
5	수박	600	9.0
6	참외	500	8.0
7	참외	400	7.5
8	참외	450	5.0
9	참외	400	4.5
10	참외	600	9.5
11	참외	550	8.5
```

---

### Step 2. 입력 데이터와 정답 데이터 분리

```python
import numpy as np
import pandas as pd

# 모델 학습에 사용할 특징 데이터(Feature)인 무게와 길이 열을 추출합니다.
# to_numpy() 함수를 써서 판다스 데이터프레임을 모델 연산에 적합한 넘파이 배열(배열 형태)로 변환합니다.
data = src_data[['무게', '길이']].to_numpy()

# 모델이 최종적으로 맞춰야 할 정답 데이터(Target)인 '종류' 열을 추출하고 넘파이 배열로 변환합니다.
target = src_data[['종류']].to_numpy()

print(data)
print(target)
```

**[출력 결과]**
```text
[[2000.    30. ]
 [2500.    25. ]
 [1800.    20. ]
 [1500.    16. ]
 [1900.    19. ]
 [ 600.     9. ]
 [ 500.     8. ]
 [ 400.     7.5]
 [ 450.     5. ]
 [ 400.     4.5]
 [ 600.     9.5]
 [ 550.     8.5]]
[['수박']
 ['수박']
 ['수박']
 ['수박']
 ['수박']
 ['수박']
 ['참외']
 ['참외']
 ['참외']
 ['참외']
 ['참외']
 ['참외']]
```

---

### Step 3. 훈련용 데이터와 테스트용 데이터 1차 분리 (Hold-out)

교차검증 없이 가장 기본적으로 데이터를 한 번만 나누는 방식입니다.

```python
# 데이터를 훈련용과 테스트용으로 쉽게 섞어서 나누어주는 train_test_split 함수를 가져옵니다.
from sklearn.model_selection import train_test_split

# 전체 데이터 중 20%(test_size=0.2)를 테스트용으로 할당하고, 나머지 80%를 훈련용으로 할당합니다.
# random_state=10은 데이터를 섞을 때 항상 동일한 방식으로 섞이도록 기준값을 고정하는 것입니다.
훈련용_data, 테스트용_data, 훈련용_target, 테스트용_target = train_test_split(data, target, test_size=0.2, random_state=10)
```

---

### Step 4. 교차검증 없이 단일 모델 검증

한 번만 훈련하고 평가하는 기본적인 방식의 한계를 확인해봅니다.

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression

# 의사결정트리(Decision Tree) 분류 알고리즘 객체를 생성합니다.
dt = DecisionTreeClassifier(random_state=10)

# 나누어둔 훈련용 데이터(X)와 정답(Y)만을 사용하여 모델을 학습시킵니다.
dt.fit(훈련용_data, 훈련용_target)

# 학습된 모델에 훈련용 데이터를 다시 넣었을 때의 정확도(score)를 출력합니다. (보통 100%가 나옵니다)
print('훈련용 데이터 기준 정확도 :', dt.score(훈련용_data, 훈련용_target))

# 학습에 사용되지 않은 따로 빼둔 테스트용 데이터로 최종 정확도를 평가합니다.
print('테스트용 데이터 기준 정확도 :', dt.score(테스트용_data, 테스트용_target))
```

**[출력 결과]**
```text
훈련용 데이터 기준 정확도 : 1.0
테스트용 데이터 기준 정확도 : 1.0
```
*(단일 테스트 결과가 1.0(100%)으로 완벽하게 나왔지만, 전체 과일 데이터가 12개뿐이라 우연히 쉬운 데이터가 테스트로 뽑혔을 가능성이 높습니다. 신뢰성이 떨어지므로 이때 K-Fold 교차검증이 활약합니다.)*

---

### Step 5. 3-Fold 교차 검증 수행 (데이터를 3조각으로 나눔)

훈련용 데이터를 다시 3개의 조각(Fold)으로 나누고 번갈아가며 철저하게 검증합니다.

```python
from sklearn.model_selection import cross_validate, cross_val_score
from sklearn.tree import DecisionTreeClassifier

# 의사결정트리 모델을 초기화합니다.
dt = DecisionTreeClassifier(random_state=10)

# cross_validate(): cv=3 옵션으로 데이터를 3개로 나누어 3번 교차 검증합니다.
# 학습 소요 시간, 평가 소요 시간, 그리고 각 3번의 테스트 점수(test_score)를 딕셔너리 형태로 상세히 보여줍니다.
scores_1 = cross_validate(dt, 훈련용_data, 훈련용_target, cv=3)

# cross_val_score(): 위 함수와 원리는 같지만 상세 시간 등은 생략하고, 각 회차의 점수 배열만 심플하게 반환합니다.
scores_2 = cross_val_score(dt, 훈련용_data, 훈련용_target, cv=3)

print('cross_validate 상세 결과:', scores_1)

# scores_1 결과 중 'test_score'(각 회차 점수들)를 가져와 numpy의 mean 함수로 평균 정확도를 구합니다.
print('cross_validate 평균 정확도:', np.mean(scores_1['test_score']))

# scores_2가 반환한 점수 배열의 평균을 구합니다. (동일한 값을 보여줍니다)
print('cross_val_score 평균 정확도:', np.mean(scores_2))
```

**[출력 결과]**
```text
cross_validate 결과: {'fit_time': array([0.0011394 , 0.00114346, 0.00066853]), 'score_time': array([0.00044489, 0.00053668, 0.00041699]), 'test_score': array([0.66666667, 1.        , 0.66666667])}
cross_validate 평균 정확도: 0.7777777777777777
cross_val_score 평균 정확도: 0.7777777777777777
```

---

### Step 6. 5-Fold 교차검증 수행 (데이터를 5조각으로 나눔)

이번에는 조각(K)을 5개로 늘려서 더욱 세밀하게 교차 검증을 진행합니다.

```python
from sklearn.model_selection import cross_validate, cross_val_score
from sklearn.tree import DecisionTreeClassifier

# 다시 새로운 모델을 만듭니다.
dt = DecisionTreeClassifier(random_state=10)

# cv=5 옵션으로 5-Fold 교차 검증을 수행합니다. 데이터를 5조각으로 나누어 총 5번 훈련 및 평가합니다.
scores_1 = cross_validate(dt, 훈련용_data, 훈련용_target, cv=5)
scores_2 = cross_val_score(dt, 훈련용_data, 훈련용_target, cv=5)

print('cross_validate 상세 결과:', scores_1)
print('cross_validate 평균 정확도:', np.mean(scores_1['test_score']))
print('cross_val_score 평균 정확도:', np.mean(scores_2))
```

**[출력 결과]**
```text
cross_validate 결과: {'fit_time': array([0.00177217, 0.00061226, 0.00055718, 0.00050354, 0.00073457]), 'score_time': array([0.00052023, 0.00038433, 0.0003643 , 0.00041318, 0.00041556]), 'test_score': array([0.5, 1. , 0.5, 1. , 1. ])}
cross_validate 평균 정확도: 0.8
cross_val_score 평균 정확도: 0.8
```

> **💡 요약 결론**
> 교차검증 없이 한 번만 테스트했을 때(Step 4)는 100%의 정확도가 나왔지만, 데이터 조각을 바꿔가며 **교차검증(K-Fold)을 수행해 보니 이 모델의 실제 평균 정확도는 77% ~ 80% 수준**이라는 것을 보다 냉정하고 객관적으로 파악할 수 있었습니다. K-Fold는 모델이 실제 서비스에서 만나게 될 미지의 데이터에서도 얼마나 잘 작동할지 가장 정확하게 예측해주는 강력한 도구입니다.
