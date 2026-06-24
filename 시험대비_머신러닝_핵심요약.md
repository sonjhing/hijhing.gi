# 📝 인공지능 프로그래밍 기초 - 머신러닝 시험 대비 핵심 요약 & 팁

지금까지 다루었던 주요 머신러닝 알고리즘과 검증 기법들을 시험용으로 한눈에 볼 수 있도록 요약한 자료입니다. 각 알고리즘의 **특징, 필수 키워드, 그리고 시험에 자주 나오는 핵심 포인트**를 중심으로 정리했습니다.

---

## 1. 모델 평가 및 최적화 (시험 출제 1순위 개념)

### 📌 K-Fold 교차검증 (Cross Validation)
*   **개념:** 전체 데이터를 K개의 조각(Fold)으로 나누어, 돌아가면서 한 조각을 테스트용으로, 나머지를 훈련용으로 사용하여 총 K번 평가하는 방식입니다.
*   **왜 쓰나요?** 데이터가 적을 때 한 번만 나누면 우연히 결과가 좋거나 나쁠 수 있습니다. 이를 방지하고 **모델의 진짜(객관적인) 성능**을 평가하기 위해 씁니다. 또한 특정 데이터에만 맞춰지는 **과적합(Overfitting)을 방지**합니다.
*   **핵심 함수:** `cross_validate`(상세 정보 반환), `cross_val_score`(점수 배열만 반환)

### 📌 그리드 서치 (Grid Search)
*   **개념:** 개발자가 수동으로 설정해야 하는 **하이퍼파라미터**들의 여러 후보값을 격자(Grid)처럼 나열해두고, **가능한 모든 조합을 자동으로 테스트**하여 최적의 설정을 찾는 기법입니다.
*   **특징:** 내부적으로 항상 교차검증(K-Fold)을 함께 수행하며 최고 성능을 찾습니다.
*   **핵심 코드 속성:**
    *   `GridSearchCV(모델, 파라미터범위)`: 객체 생성
    *   `best_params_`: 테스트 결과 가장 성적이 좋았던 최고의 파라미터 조합
    *   `best_estimator_`: 최고 성적을 낸 파라미터가 적용된 완성형 모델

---

## 2. 지도 학습: 분류(Classification) 알고리즘

### 📌 로지스틱 회귀 (Logistic Regression)
*   **개념:** 이름은 '회귀'지만 **실제로는 그룹을 나누는 "분류"** 알고리즘입니다. (예: 합격/불합격, 스팸/정상)
*   **원리:** 선형 방정식의 결과를 시그모이드(Sigmoid) 또는 소프트맥스(Softmax) 함수를 통해 **0~1 사이의 확률값**으로 변환하여 분류합니다.
*   **시험 대비 Tip:**
    *   결과뿐만 아니라 **확률(가능성)**을 구하고 싶을 때 씁니다.
    *   `predict()`는 최종 분류 결과(예/아니오)를 반환하고, `predict_proba()`는 각 클래스에 속할 0~1 사이의 **확률값**을 반환합니다.
    *   특성 간 단위가 다르면 모델이 헷갈려하므로 **데이터 표준화(`StandardScaler`)가 필수적**입니다.

### 📌 KNN (K-최근접 이웃, K-Nearest Neighbors)
*   **개념:** 새로운 데이터가 들어오면 기존 데이터 중 **가장 가까운 K개의 이웃**을 찾고, 그 이웃들이 가장 많이 속한 그룹으로 다수결 판정을 내립니다.
*   **특징:** 사실상 훈련(학습) 과정이 없고, 데이터를 저장해 두었다가 예측할 때마다 거리를 계산합니다.
*   **시험 대비 Tip:**
    *   구현이 쉽고 직관적이지만, 데이터가 아주 많아지면 거리 계산에 시간이 오래 걸려 **느려집니다**.
    *   이웃의 수 **K 값을 몇으로 하느냐에 따라 성능이 크게 달라지며**, 이를 찾는 것이 핵심입니다. (보통 K를 1부터 늘려가며 정확도 그래프를 그려 판단합니다.)

### 📌 의사결정나무 (Decision Tree)
*   **개념:** 스무고개 놀이처럼 예/아니오 질문을 반복하며 데이터를 분할하여 나무 가지치기 형태로 분류하는 알고리즘입니다.
*   **시험 대비 Tip:**
    *   과정이 직관적이라 사람이 이해하고 설명하기 매우 좋습니다.
    *   단점: 질문(깊이, `max_depth`)을 너무 많이 하면 훈련 데이터에만 완벽히 맞춰지는 **과적합(Overfitting) 현상이 매우 쉽게 발생**합니다. 이를 막기 위해 가지치기(트리 깊이 제한)가 필수입니다.

### 📌 앙상블: 랜덤 포레스트 (Random Forest)
*   **개념:** 의사결정나무 1개만 쓰면 과적합되기 쉬운 단점을 극복하기 위해, **무작위로 데이터를 뽑아 수많은 의사결정나무(숲)를 만들고 이들의 의견을 다수결로 종합**하는 방식(앙상블 기법)입니다.
*   **시험 대비 Tip:**
    *   분류에서 **일반적으로 성능이 매우 뛰어나고 안정적**이어서 가장 널리 쓰이는 강력한 알고리즘입니다.
    *   **피처 중요도(`feature_importances_`)**: 어떤 데이터 요소(무게, 길이 등)가 정답을 맞히는 데 가장 큰 기여를 했는지 쉽게 뽑아볼 수 있습니다. 

---

## 3. 비지도 학습: 군집(Clustering) 알고리즘

### 📌 K-Means 군집 분석
*   **개념:** 정답(Target)이 없는 데이터들을 거리가 가까운 것들끼리 묶어 K개의 그룹(군집)으로 나누는 **비지도 학습** 알고리즘입니다.
*   **원리:** K개의 중심점(Centroid)을 찍고 -> 가까운 데이터 묶기 -> 그룹의 중앙으로 중심점 이동 -> 다시 묶기 과정을 중심점이 멈출 때까지 반복합니다.
*   **시험 대비 Tip:**
    *   정답(Label)이 없을 때 자체적인 패턴을 찾거나 고객을 세분화할 때 씁니다.
    *   **가장 큰 단점:** 데이터가 몇 개의 그룹(K)으로 나뉘어야 할지 **사람이 미리 정해줘야 합니다.**
    *   **Inertia (응집도):** 군집의 중심과 데이터 간의 거리를 모두 합한 값입니다. 작을수록 데이터가 잘 뭉쳐있음을 뜻합니다.
    *   **Elbow Method (엘보우 기법):** K값을 1, 2, 3... 늘려가며 Inertia 값을 그래프로 그렸을 때, **팔꿈치처럼 꺾이는(완만해지는) 지점**이 가장 이상적인 군집의 개수(K)입니다.

### 📌 DBSCAN (밀도 기반 군집화)
*   **개념:** 데이터가 **촘촘하게 밀집된 부분(밀도)**을 찾아 하나의 군집으로 묶는 비지도 학습 알고리즘입니다.
*   **시험 대비 Tip:**
    *   K-Means의 단점(원형이 아닌 데이터 분류 불가, K개수 지정 필요)을 보완합니다. 반달(Moon) 모양이나 불규칙한 데이터에 아주 강합니다.
    *   몇 개의 그룹으로 나눌지 **미리 정해줄 필요가 없습니다.** 스스로 찾습니다.
    *   **이상치(Noise/Outlier) 탐지가 가능**합니다. (어느 그룹에도 속하지 못하는 동떨어진 데이터를 찾아내어 -1로 분류합니다.)
    *   `eps`(이웃 반경)와 `min_samples`(최소 데이터 수) 파라미터가 매우 중요합니다.

---

## 💯 시험 직전 코딩 테스트 / 실습 꿀팁

1.  **데이터 분리 습관화:** `train_test_split`은 무조건 씁니다. 학습은 `훈련용_data`로(`fit`), 평가(`score`)나 예측(`predict`)은 `테스트용_data`로 해야 점수를 인정받습니다.
2.  **데이터 형태:** 사이킷런(Scikit-learn) 모델에 데이터를 넣을 때 입력 데이터(X)는 항상 **2차원 배열(데이터프레임 형태 등)**이어야 합니다. `[[무게, 길이]]` 처럼 괄호가 2개 겹쳐야 함을 잊지 마세요.
3.  **코드 흐름 기억하기:** 어떤 알고리즘이든 흐름은 똑같습니다.
    *   ① 모델 선언 (`model = 모델명()`)
    *   ② 학습 (`model.fit(훈련X, 훈련Y)`)
    *   ③ 평가/예측 (`model.score(테스트X, 테스트Y)`, `model.predict(새로운데이터)`)
4.  **폰트 에러:** 그래프를 그리는데 한글이 네모로 깨져서 나온다면, 폰트 설치 코드(`!sudo apt-get install fonts-nanum...`)를 빼먹었거나, 폰트 적용 코드(`plt.rc('font', family=...)`)를 작성하지 않은 것입니다.
5.  **다중 분류 필수 항목:** 만약 정답 클래스가 3개 이상이라면, 단순 `predict` 결과 외에도 `predict_proba`를 출력하여 "왜 이 결과가 나왔는지 각 확률값"을 확인하는 과정이 실습에 꼭 들어갑니다.

---

## 🚀 4. 고득점 달성을 위한 필살기: 앙상블 모델 조합 (Ensemble)

개별 알고리즘으로 점수가 더 이상 오르지 않을 때, 여러 모델을 하나로 섞어서 최고점을 쥐어짜 내는 기법입니다. (대회나 시험에서 가장 높은 점수 획득 목적)

### 📌 1) 투표 방식 (Voting Classifier) - 🌟 가장 쉽고 빠름
*   **개념:** 여러 모델(로지스틱, 트리, 랜덤포레스트 등)에게 같은 문제를 풀게 하고 확률의 평균을 내어 최종 정답을 결정합니다.
*   **시험 대비 Tip:** 
    *   AUC 점수를 최대로 끌어올리려면 투표 방식을 `voting='soft'`로 설정해야 합니다.

```python
from sklearn.ensemble import VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score

# 1. 개별 모델(어벤져스 팀원) 준비
lr = LogisticRegression(random_state=42)
dt = DecisionTreeClassifier(max_depth=5, random_state=42)
rf = RandomForestClassifier(n_estimators=100, random_state=42)

# 2. 투표 모델로 하나로 묶기 (voting='soft' 필수)
voting_model = VotingClassifier(
    estimators=[('LR', lr), ('DT', dt), ('RF', rf)],
    voting='soft'
)

# 3. 팀 단위로 한 번에 학습시키고 점수 확인
voting_model.fit(x_train, y_train)
voting_auc = roc_auc_score(y_test, voting_model.predict_proba(x_test)[:, 1])
print("최종 투표 모델 AUC 점수:", voting_auc)
```

### 📌 2) 스태킹 방식 (Stacking Classifier) - 🚀 최고점 갱신용
*   **개념:** 여러 '일꾼 모델'들이 예측한 정답들을 모아서 새로운 문제지(데이터)로 만든 뒤, 똑똑한 '대장 모델(메타 모델)'이 그걸 보고 최종 정답을 판단하는 아주 고도화된 방식입니다.
*   **시험 대비 Tip:** 보통 랜덤포레스트, 트리, SVM 등을 일꾼으로 쓰고, 최종 대장으로는 **로지스틱 회귀**를 씁니다. 연산 시간은 좀 걸리지만 무조건 점수가 오르는 마법의 조합입니다.

```python
from sklearn.ensemble import StackingClassifier
from sklearn.svm import LinearSVC

# 1. 기초 예측을 담당할 일꾼 모델들 준비
base_models = [
    ('RF', RandomForestClassifier(n_estimators=100, random_state=42)),
    ('DT', DecisionTreeClassifier(max_depth=5, random_state=42)),
    ('SVC', LinearSVC(random_state=42)) 
]

# 2. 일꾼들의 의견을 모아 최종 결정을 내릴 대장 모델 준비
meta_model = LogisticRegression()

# 3. 스태킹 모델로 하나로 조립 (cv=3 은 내부 교차검증 횟수)
stacking_model = StackingClassifier(
    estimators=base_models,
    final_estimator=meta_model,
    cv=3
)

# 4. 학습 및 최종 성적표 확인
stacking_model.fit(x_train, y_train)
stacking_auc = roc_auc_score(y_test, stacking_model.predict_proba(x_test)[:, 1])
print("최종 스태킹 모델 AUC 점수:", stacking_auc)
```
