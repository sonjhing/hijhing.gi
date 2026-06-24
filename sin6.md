# 💳 신용카드 사기 탐지 (대용량/불균형 데이터 실습)

## 📌 이 코드는 왜 사용했나요? (학습 목적)

이 실습 코드는 단순한 장난감 데이터가 아닌, **실제 현업(실무)에서 마주치는 가장 어려운 상황 두 가지**를 해결하기 위해 작성(사용)되었습니다.

1. **극심한 데이터 불균형 (Imbalanced Data) 해결:** 
   * 신용카드 결제 내역 중 정상 결제는 수십만 건이지만, 실제 사기(Fraud) 결제는 몇백 건에 불과합니다. 이런 데이터를 모델에 그대로 넣으면 "전부 정상이야!"라고만 찍어도 정확도가 99%가 나오는 치명적인 문제가 발생합니다. 이를 극복하고 사기 데이터를 정확히 짚어내기 위해 `Precision`, `F1 Score`, 그리고 특히 **`AUC (ROC-AUC) 점수`**를 평가지표로 사용합니다.
2. **대용량 데이터의 학습 속도 문제 해결 (LinearSVC 도입):**
   * 데이터가 28만 개가 넘어가기 때문에 기본 SVM(RBF 커널)을 사용하면 학습이 하루 종일 걸릴 수 있습니다. 따라서 대용량 처리에 특화되고 속도가 압도적으로 빠른 **`LinearSVC`**를 사용하여 대용량 데이터를 처리하는 노하우를 익히기 위함입니다.
3. **가장 중요한 특성만 뽑아내기 (Feature Selection):**
   * 수많은 정보(Feature) 중에서 쓸데없는 정보는 버리고, 사기 판별에 **가장 큰 영향을 미치는 핵심 변수 상위 10개(Top 10)**만 뽑아서 다시 가볍고 정확하게 모델을 학습시키는 실무 기법을 배웁니다.

---

## 1. 데이터 로드 및 확인

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier

# 1) 로컬에 있는 대용량 신용카드 결제 내역 데이터셋을 불러옵니다.
data = pd.read_csv('D:/data/creditcard.csv')

# 데이터 구조를 대략적으로 확인합니다.
data
```

**[실행 결과]**
```text
284807 rows × 31 columns
... (중략: 약 28만 건의 거래 내역과 V1~V28 특징, 결제금액(Amount), 사기여부(Class) 존재)
```

## 2. 데이터 불균형 확인 및 데이터 분할

```python
# target 데이터(Class: 정답)의 분포를 확인합니다. 0은 정상, 1은 사기를 의미합니다.
print("Class Distribution:")
print(data['Class'].value_counts())
```

**[실행 결과]**
```text
Class Distribution:
0    284315
1       492
Name: count, dtype: int64
```
*(정상이 무려 28만 건인데 사기는 492건뿐인 극심한 불균형 상태임을 확인할 수 있습니다.)*

```python
# 정답 예측에 불필요한 'Time' 컬럼과, 정답 컬럼인 'Class'를 빼서 문제지(x)를 만듭니다.
x = data.drop(['Time', 'Class'], axis=1)

# 'Class' 컬럼만 뽑아서 정답지(y)를 만듭니다.
y = data['Class']

# 데이터를 훈련용(80%)과 테스트용(20%) 세트로 분할합니다. 
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

# 잘 나뉘었는지 분포를 다시 확인해봅니다.
print(y_train.value_counts())
print(y_test.value_counts())

# 단위가 제각각인 데이터를 0을 기준으로 모여있도록 표준화(스케일링) 작업을 실시합니다.
scaler = StandardScaler()
x_train = scaler.fit_transform(x_train) # 훈련 데이터로 기준을 맞추고 변환
x_test = scaler.transform(x_test)       # 테스트 데이터는 그 기준에 맞춰 변환만 진행
```

---

## 3. 알고리즘 1: 로지스틱 회귀 (Logistic Regression)

```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, precision_score, accuracy_score

# 로지스틱 회귀 모델 객체를 생성합니다. (max_iter=1000으로 충분히 반복 학습하게 합니다)
lr = LogisticRegression(max_iter=1000, random_state=42)

# 모델 학습
lr.fit(x_train, y_train)

# 학습된 모델로 테스트 데이터를 주어 사기인지 예측합니다.
예측값 = lr.predict(x_test)

# 평가지표 출력: 정답률(Accuracy), 사기라고 찍은것 중 진짜 사기 비율(Precision), F1 점수
print("Accuracy:", accuracy_score(y_test, 예측값))
print("Precision:", precision_score(y_test, 예측값, zero_division=0))
print("F1 Score:", f1_score(y_test, 예측값, zero_division=0))

# 불균형 데이터의 핵심 평가 지표인 AUC 점수를 계산합니다. (1에 가까울수록 좋은 모델)
# 확률값(predict_proba)의 [:, 1] (양성=사기일 확률)을 사용해야 합니다.
lr_auc_score = roc_auc_score(y_test, lr.predict_proba(x_test)[:, 1])
print("Logistic Regression AUC score:", lr_auc_score)
```

**[결과 요약]**
* AUC 점수: **0.976** (매우 우수)

---

## 4. 알고리즘 2: 의사결정나무 (Decision Tree)

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import f1_score, precision_score, accuracy_score, roc_auc_score

# 결정 트리 모델을 생성하고 학습합니다.
dt = DecisionTreeClassifier()
dt.fit(x_train, y_train)

# 모델 평가
예측값 = dt.predict(x_test)

print("Accuracy:", accuracy_score(y_test, 예측값))
print("Precision:", precision_score(y_test, 예측값, zero_division=0))
print("F1 Score:", f1_score(y_test, 예측값, zero_division=0))

# 결정트리 AUC 점수 계산
dt_auc_score = roc_auc_score(y_test, dt.predict_proba(x_test)[:, 1])
print("Decision Tree AUC score:", dt_auc_score)
```

**[결과 요약]**
* AUC 점수: **0.897** (로지스틱보다 조금 떨어짐)

---

## 5. 알고리즘 3: 랜덤 포레스트 (Random Forest) 및 Feature Selection

랜덤 포레스트로 성능을 올리고, 수많은 변수 중 가장 중요한 특성을 뽑아 가볍게 재학습해봅니다.

```python
from sklearn.ensemble import RandomForestClassifier

# 랜덤 포레스트 실습: n_estimators(트리 개수) 100개 지정
# 대용량 데이터이므로 CPU 코어 전체 사용(n_jobs=-1)으로 학습 속도 개선
rf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)

# 1) 전체 변수(약 29개)로 학습/예측
rf.fit(x_train, y_train)
예측값 = rf.predict(x_test)

# 2) 분류 평가지표 출력
print("Accuracy:", accuracy_score(y_test, 예측값))
print("Precision:", precision_score(y_test, 예측값, zero_division=0))
print("F1 Score:", f1_score(y_test, 예측값, zero_division=0))

# 3) 랜덤포레스트 AUC 계산
rf_auc_score = roc_auc_score(y_test, rf.predict_proba(x_test)[:, 1])
print("Random Forest AUC Score:", rf_auc_score)

# -------------------------------------------------------------
# 4) Feature Importance 확인 (모델이 어떤 변수를 중요하게 보는지 추출)
# -------------------------------------------------------------
import matplotlib.pyplot as plt
import numpy as np

# 피처 중요도를 뽑아옵니다.
imp = rf.feature_importances_
print("Feature Importances:", imp)

# 시각화 (중요도 막대그래프)
plt.figure(figsize=(10, 6))
plt.bar(range(len(imp)), imp)
plt.xlabel('column')
plt.ylabel('Importance')
plt.title('Feature Importance')
plt.show()

# -------------------------------------------------------------
# 5) 상위 핵심 변수 추출 및 재학습
# -------------------------------------------------------------
# argmax를 써서 가장 중요한 1등 변수가 몇 번째인지 찾습니다.
most_important_feature = np.argmax(imp)
print("Most Important Feature Index:", most_important_feature)
print("Most Important Feature Name:", x.columns[most_important_feature])

# argsort를 통해 중요도 기준 상위 10개 변수 인덱스만 추출합니다.
top_10_features = np.argsort(imp)[-10:][::-1]
print("Top 10 Feature Indices:", top_10_features)
print("Top 10 Feature Names:", x.columns[top_10_features])

# 원본 데이터(x)에서 방금 찾은 상위 10개 핵심 변수만 잘라냅니다.
x_top_10 = x.iloc[:, top_10_features]

# 그 10개의 변수만 가지고 다시 훈련/테스트용 데이터를 자르고 스케일링합니다.
x_train_top_10, x_test_top_10, y_train, y_test = train_test_split(x_top_10, y, test_size=0.2, random_state=42)
x_train_top_10 = scaler.fit_transform(x_train_top_10)
x_test_top_10 = scaler.transform(x_test_top_10)

# 10개 변수만 가진 데이터로 가볍게 새 랜덤포레스트를 훈련시킵니다.
rf_top_10 = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
rf_top_10.fit(x_train_top_10, y_train)
예측값_top_10 = rf_top_10.predict(x_test_top_10)

print("Accuracy:", accuracy_score(y_test, 예측값_top_10))
print("Precision:", precision_score(y_test, 예측값_top_10, zero_division=0))
print("F1 Score:", f1_score(y_test, 예측값_top_10, zero_division=0))

# 10개 변수 모델의 최종 AUC 확인
rf_top_10_auc_score = roc_auc_score(y_test, rf_top_10.predict_proba(x_test_top_10)[:, 1])
print("Random Forest (Top 10 Features) AUC Score:", rf_top_10_auc_score)
```

**[결과 요약]**
* 전체 변수 학습 시 AUC: **0.952**
* 핵심 상위 10개 변수만 학습 시 AUC: **0.947** 
*(해석: 쓸데없는 데이터를 다 쳐내고 핵심 10개만 남겼는데도 성능이 거의 떨어지지 않고 비슷하게 방어되었습니다! 모델은 더 가벼워지고 연산은 빨라졌습니다.)*

---

## 6. 알고리즘 4: 대용량 처리용 Linear SVM 적용

일반적인 SVM은 거리를 계산하는 공식이 무거워서 28만 개의 데이터에 넣으면 터지거나 몇 시간이 걸립니다. 대용량 처리를 위한 `LinearSVC`를 씁니다.

```python
# SVM 실습(대용량용): LinearSVC 사용
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, precision_score, f1_score, roc_auc_score
import time

# 알고리즘이 얼마나 빨리 돌아가는지 초를 재기 위한 타이머 시작 (시험 대비 포인트)
start = time.time()

# 핵심 포인트 1: 데이터 불균형을 해결하기 위해 'class_weight="balanced"'를 주어 모델이 사기 데이터를 더 신경쓰게 만듭니다.
# 핵심 포인트 2: 대용량 데이터에서는 기본 SVC(kernel='rbf')보다 LinearSVC가 수십 배 더 빠릅니다.
svm = LinearSVC(class_weight='balanced', random_state=42, max_iter=5000)

# 학습 및 예측
svm.fit(x_train, y_train)
예측값 = svm.predict(x_test)

# 분류 지표 출력
print("Accuracy:", accuracy_score(y_test, 예측값))
print("Precision:", precision_score(y_test, 예측값, zero_division=0))
print("F1 Score:", f1_score(y_test, 예측값, zero_division=0))

# 핵심 포인트 3: LinearSVC 알고리즘은 안타깝게도 확률을 반환하는 'predict_proba' 함수가 없습니다!
# 따라서 확률값 대신 decision_function 점수를 가져와서 AUC 점수를 계산해야 에러가 안 납니다.
svm_auc_score = roc_auc_score(y_test, svm.decision_function(x_test))
print("Linear SVM AUC score:", svm_auc_score)

# 소요 시간 출력 (약 2초밖에 안 걸림을 증명)
print(f"학습+예측 시간: {time.time() - start:.2f}초")
```

**[결과 요약]**
* Linear SVM AUC: **0.981** (현재까지 가장 높은 1등 성능 기록!)
* 소요 시간: 단 **2.16초**

---

## 7. 최상위 성능 모델 튜닝: 그리드 서치 (GridSearch) 적용

방금 가장 높은 성적(0.98)을 받았던 SVM 모델의 설정을 컴퓨터가 며칠을 돌려 최고를 찾아주도록 '그리드 서치'에 넣습니다.

```python
# 가장 AUC가 높았던 Linear SVM 모델을 GridSearch로 최고치까지 튜닝
from sklearn.svm import LinearSVC
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.metrics import roc_auc_score, accuracy_score, precision_score, f1_score
import time

start = time.time()

# 일반적인 KFold가 아닌 StratifiedKFold 사용 이유: 
# 극심한 불균형 데이터이므로 섞을 때마다 정상/사기의 '비율'이 무너지지 않게 일정하게 유지시켜 줍니다.
cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

# 컴퓨터가 찾아볼 파라미터(설정값) 조합 리스트
# C (규제 강도), class_weight (가중치), max_iter (최대 반복 횟수)
param_grid = {
    'C': [0.01, 0.1, 1, 10],
    'class_weight': [None, 'balanced'],
    'max_iter': [3000, 5000]
}

# 그리드 서치 객체 설정
# scoring='roc_auc' : 일반적인 정확도(Accuracy) 기준이 아니라, AUC 점수를 1순위 기준으로 가장 높은 모델을 찾으라고 명령함!
grid = GridSearchCV(
    estimator=LinearSVC(random_state=42),
    param_grid=param_grid,
    scoring='roc_auc', 
    cv=cv,
    n_jobs=-1,  # CPU 풀가동
    verbose=1   # 진행 상황 로그 출력
)

# 하이퍼파라미터 48개 조합 탐색 실행
grid.fit(x_train, y_train)

# 제일 성적이 좋았던 똑똑한 모델(best_estimator_)을 가져와서 최종 평가
best_model = grid.best_estimator_
예측값 = best_model.predict(x_test)
auc = roc_auc_score(y_test, best_model.decision_function(x_test))

# 최종 결과 성적표 출력
print('Best Params:', grid.best_params_)
print('Best CV AUC:', grid.best_score_)
print('Test Accuracy:', accuracy_score(y_test, 예측값))
print('Test Precision:', precision_score(y_test, 예측값, zero_division=0))
print('Test F1 Score:', f1_score(y_test, 예측값, zero_division=0))
print('Test AUC:', auc)
print(f"GridSearch 소요시간: {time.time() - start:.2f}초")
```

**[최종 결과 분석]**
* GridSearch가 찾아낸 최고의 조합: `{'C': 0.01, 'class_weight': 'balanced', 'max_iter': 3000}`
* 튜닝 후 최종 AUC 점수: **0.982** (미세하게 더 향상됨)
* 소요 시간: 13.6초 (조합을 다 테스트하느라 오래 걸렸지만, 매우 가치있는 결과입니다)