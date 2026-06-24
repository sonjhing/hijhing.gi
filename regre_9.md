# [회귀, 분류] 인공지능프로그래밍기초 - 9. 그리드서치 (Grid Search)

## 📌 그리드 서치(Grid Search)란 무엇인가요?

머신러닝 모델에는 사람이 직접 설정해주어야 하는 수많은 옵션(설정값)들이 있습니다. 이를 **하이퍼파라미터(Hyperparameter)**라고 부릅니다. 
**그리드 서치(Grid Search)**는 우리가 테스트해보고 싶은 여러 하이퍼파라미터 값들의 후보를 격자(Grid)처럼 모두 만들어 놓고, 모델이 **가능한 모든 조합을 하나씩 다 테스트(교차 검증)해보며 가장 성능이 좋은 최적의 설정값을 찾아주는 자동화 기법**입니다.

## 🎯 언제 사용할까요?

1. **최적의 모델 성능을 뽑아내고 싶을 때:** 기본 설정값만 사용하는 것보다 데이터에 가장 알맞은 하이퍼파라미터를 찾으면 정확도를 크게 높일 수 있습니다.
2. **수동으로 값을 바꿔가며 테스트하기 너무 힘들 때:** 사람이 일일이 값을 바꾸면서 어느 조합이 가장 좋은지 비교하는 것은 너무 많은 시간이 걸리므로, 그리드 서치를 통해 컴퓨터가 자동으로 모든 경우의 수를 비교하게 할 때 사용합니다.

---

## 💻 실습: 의사결정나무 모델의 최적 설정값 찾기

### 1) 데이터 로드

```python
# 컴퓨터에서 작업하려면 아래 코드를 실행하면 됩니다
import pandas as pd

# 과일 종류 데이터를 불러옵니다.
src_data = pd.read_csv('./머신러닝실습용자료/의사결정나무_과일종류_2가지.csv', encoding='cp949')

# 데이터를 화면에 출력하여 확인합니다.
src_data
```

**[실행 결과]**
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

### 2) 훈련용/테스트용 데이터 분리

```python
# Step 3. 주어진 데이터를 훈련용 데이터와 검증용 데이터로 나눕니다
import numpy as np

# '무게'와 '길이' 데이터를 입력(Feature)으로 사용합니다.
data = src_data[['무게', '길이']]
# '종류'를 정답(Target)으로 사용합니다.
target = src_data['종류']

# 전체 데이터 출력
print(data)
print(target)

# 데이터를 훈련용과 테스트용으로 분리하기 위한 함수를 불러옵니다.
from sklearn.model_selection import train_test_split

# 데이터를 섞어서 훈련용과 테스트용으로 나눕니다. (기본 비율: 훈련 75%, 테스트 25%)
훈련용_data, 테스트용_data, 훈련용_target, 테스트용_target = train_test_split(data, target)

# 잘 나뉘었는지 각 데이터를 확인합니다.
print(훈련용_data)
print(훈련용_target)
print(테스트용_data)
print(테스트용_target)
```

**[실행 결과]**
```text
    무게    길이
0   2000  30.0
1   2500  25.0
... (중략) ...
11   550   8.5

0     수박
1     수박
... (중략) ...
11    참외
Name: 종류, dtype: str

    무게    길이
11   550   8.5
10   600   9.5
... (중략) ...
4   1900  19.0

11    참외
10    참외
... (중략) ...
4     수박
Name: 종류, dtype: str

    무게    길이
9   400   4.5
2  1800  20.0
1  2500  25.0

9    참외
2    수박
1    수박
Name: 종류, dtype: str
```

---

### 3) 간단한 GridSearch (max_depth만)

의사결정나무의 최대 깊이(`max_depth`) 옵션 중 어느 것이 가장 좋은지 찾아봅니다.

```python
# 그리드 서치 모듈과 의사결정나무 알고리즘을 불러옵니다.
from sklearn.model_selection import GridSearchCV
from sklearn.tree import DecisionTreeClassifier

# 테스트해볼 하이퍼파라미터의 목록을 딕셔너리 형태로 지정합니다.
# 최대 트리 깊이를 1, 2, 3으로 각각 설정했을 때 언제가 가장 좋은지 알아보겠습니다.
parm = {'max_depth':[1,2,3]}

# 그리드 서치 객체를 생성합니다.
# DecisionTreeClassifier : 기본 모델
# parm : 테스트할 파라미터 조합
# n_jobs=-1 : 연산에 모든 CPU 코어를 사용하여 속도를 높입니다.
gs = GridSearchCV(DecisionTreeClassifier(random_state=50), parm, n_jobs=-1)

# 설정한 파라미터(1, 2, 3)를 번갈아 적용하며 교차 검증을 통해 최적의 모델을 학습시킵니다.
gs.fit(훈련용_data, 훈련용_target)
```

**[실행 로그]**
```text
UserWarning: The least populated class in y has only 4 members, which is less than n_splits=5.
```
*(경고 이유: 데이터 개수가 너무 적어서 교차 검증(기본 5회)을 수행하기엔 클래스(과일 종류)의 개수가 부족하다는 뜻입니다. 실습용 데이터라 무시해도 무방합니다.)*

```python
# 여러 조합 중 성능이 가장 높았던 최고의 파라미터 조합을 출력합니다.
print(gs.best_params_)

# 최고 성능을 낸 완성된 모델을 dt라는 변수에 저장합니다.
dt = gs.best_estimator_

# 그 최적의 모델로 훈련 데이터를 다시 평가했을 때의 점수를 확인합니다.
print(dt.score(훈련용_data, 훈련용_target))
```

**[실행 결과]**
```text
{'max_depth': 1}
0.8888888888888888
```
*(해석: 최대 깊이를 1로 설정했을 때가 가장 점수가 좋았습니다.)*

---

### 4) 복잡한 GridSearch (여러 하이퍼파라미터 조합)

여러 종류의 하이퍼파라미터를 동시에 조절하며 수백, 수천 가지의 조합 중 최고를 찾아봅니다.

```python
# 한꺼번에 여러 속성값을 찾을 경우
from sklearn.model_selection import GridSearchCV

# 세 가지 옵션의 범위(경우의 수)를 설정합니다.
parm = {
    # 1. 트리 최대 깊이: 1부터 9까지 1씩 증가 (총 9가지)
    'max_depth': range(1, 10, 1), 
    
    # 2. 노드를 나누기 위한 최소 불순도 감소량: 0.0001부터 0.001까지 0.0001씩 증가 (총 9가지)
    'min_impurity_decrease': np.arange(0.0001, 0.001, 0.0001), 
    
    # 3. 노드를 나누기 위한 최소 샘플 수: 2부터 99까지 10씩 증가 (총 10가지)
    'min_samples_split' : range(2, 100, 10) 
}
# 총 9 x 9 x 10 = 810 가지의 조합을 모두 테스트합니다!

# 그리드 서치 객체 생성
gs = GridSearchCV(DecisionTreeClassifier(random_state=50), parm, n_jobs=-1)

# 810개의 조합을 모두 대입하여 학습하고 교차검증을 통해 최고를 찾습니다.
gs.fit(훈련용_data, 훈련용_target)

# 그 수많은 조합 중 가장 결과가 좋았던 파라미터 세팅을 출력합니다.
print(gs.best_params_)
```

**[실행 로그]**
```text
UserWarning: The least populated class in y has only 4 members, which is less than n_splits=5.
```

**[실행 결과]**
```text
{'max_depth': 1, 'min_impurity_decrease': np.float64(0.0001), 'min_samples_split': 2}
```

---

### 5) 교차검증 점수 확인

최적으로 선택된 모델이 교차 검증에서 평균적으로 몇 점을 받았는지 확인합니다.

```python
# gs.cv_results_에는 810번의 모든 테스트 결과가 담겨 있습니다.
# 그중 'mean_test_score'(테스트 평균 점수)의 최고값(max)을 출력합니다.
print(np.max(gs.cv_results_['mean_test_score']))
```

**[실행 결과]**
```text
0.8
```

---

### 6) 최적 모델로 최종 평가

그리드 서치가 찾아준 가장 똑똑한 모델(`best_estimator_`)로, 학습에 한 번도 쓰이지 않은 완전히 새로운 '테스트용 데이터'를 주고 최종 성적을 매겨봅니다.

```python
# 최적의 설정이 적용된 완성형 모델을 dt 변수에 담습니다.
dt = gs.best_estimator_

# 최종 테스트용 데이터(학습에 안 쓴 데이터)를 넣어 최종 평가 점수를 확인합니다.
print(dt.score(테스트용_data, 테스트용_target))

# 참고용으로 훈련 데이터 점수도 다시 확인해 봅니다.
print(dt.score(훈련용_data, 훈련용_target))
```

**[실행 결과]**
```text
1.0
0.8888888888888888
```
*(최종적으로 새로운 테스트 데이터를 100%(1.0) 정확도로 맞추는 훌륭한 모델이 만들어졌습니다!)*