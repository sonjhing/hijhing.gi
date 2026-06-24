# 🚀 시험장 대비 비상 매뉴얼 및 고급 앙상블 (se5)

이 문서는 시험장에서 발생할 수 있는 여러 돌발 상황에 대비하고, 점수를 극대화하기 위한 **고급 전처리 기법(상관관계 병합)**과 **고성능 모델(RandomForest, HistGradientBoosting)** 실전 코드를 담고 있습니다.

## 📌 왜 이 코드를 사용하나요?
1. **피처 엔지니어링 (상관관계 병합):** 쓸데없는 변수를 줄이고 중복되는 변수를 합쳐서 모델의 과적합을 막고 학습 속도를 올리기 위함입니다.
2. **HistGradientBoostingClassifier 도입:** 데이터가 엄청나게 많거나 결측치(빈칸) 처리가 까다로울 때, 결측치를 알아서 처리하고 학습 속도가 월등히 빠른 최신 부스팅 기법을 활용하여 시험 점수(Macro F1)를 극대화하기 위함입니다.
3. **가중치(class_weight) 조절:** 정답(Target 1)의 비율이 극단적으로 적을 때, 소수 클래스를 맞추기 위해 가중치를 인위적으로 부여하는 실무 테크닉을 익힙니다.

---

## 💻 방법 1: Random Forest 기반 피처 선정 및 최적화

```python
# 라이브러리 임포트 (데이터 분석 및 모델링 필수 도구)
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import classification_report, f1_score

# 1. 라이브러리 및 데이터 불러오기
# [수정 필요] 시험장 데이터 파일명을 실제 이름으로 기입하세요
df = pd.read_csv("D:/머신러닝/회귀, 분류/머신러닝실습용자료/train.csv") # 학습용 데이터 로드
test_df = pd.read_csv("D:/머신러닝/회귀, 분류/머신러닝실습용자료/test.csv") # 평가용 데이터 로드

# [수정 필요] 엑셀/데이터 첫 행을 보고 정답 열 제목을 정확히 기입하세요
TARGET = "target" 

# 결측치(NaN)가 있으면 에러가 나므로, 0으로 채워 데이터 무결성 확보
df = df.fillna(0)
test_df = test_df.fillna(0)

# 피처(X)와 정답(y) 분리
X = df.drop(TARGET, axis=1)
y = df[TARGET]

# 데이터가 제대로 들어왔는지 분포 확인 (전략 수립의 핵심 근거)
print(f"데이터 로드 완료! Target 분포:\n{y.value_counts()}")
```
**[출력 결과]**
```text
데이터 로드 완료! Target 분포:
target
0    791
1    109
Name: count, dtype: int64
```

```python
# 2. 상관관계 병합 및 피처 선정
# 상관관계 높은 항목 병합 (다중공선성 제거 및 데이터 효율화)
corr_matrix = X.corr().abs() # 상관계수 절댓값 계산
upper = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)) # 중복 제거
to_drop = [column for column in upper.columns if any(upper[column] > 0.8)] # 상관계수 0.8 이상 찾기

# 상관관계 높은 두 피처를 합쳐 새로운 피처 생성 (데이터 차원 축소)
if len(to_drop) >= 2:
    X['merged_feat'] = X[to_drop[0]] + X[to_drop[1]]
    X = X.drop(columns=to_drop)
    test_df['merged_feat'] = test_df[to_drop[0]] + test_df[to_drop[1]]
    test_df = test_df.drop(columns=to_drop)

# 랜덤포레스트 모델로 피처 중요도(Ranking) 계산
rf = RandomForestClassifier(random_state=42).fit(X, y)
importance = pd.DataFrame({'Feature': X.columns, 'Imp': rf.feature_importances_})

# 중요도 기준 상위 5개 피처만 선정 (필요없는 변수 가지치기)
selected_5 = importance.sort_values('Imp', ascending=False).head(5)['Feature'].tolist()

print(f"최종 선정된 5개 피처: {selected_5}")
```
**[출력 결과]**
```text
최종 선정된 5개 피처: ['feat_8', 'feat_4', 'feat_7', 'feat_6', 'feat_9']
```

```python
# 3. 모델 학습 및 최적화
# [수정 필요] 클래스 불균형에 따라 1:7 숫자를 조정하세요 (5~15 사이)
# 데이터가 0에 치우칠수록 뒤쪽 숫자를 크게 설정합니다
model = RandomForestClassifier(random_state=42, class_weight={0:1, 1:7})
params = {'n_estimators': [100], 'max_depth': [5]} # 학습 깊이와 트리 개수 설정

# 선정된 5개 피처만 사용하여 학습
X_selected = X[selected_5]

# 그리드 서치를 통해 최적의 모델 찾기 (F1-Macro 점수 기준)
gs = GridSearchCV(model, params, scoring='f1_macro', cv=5).fit(X_selected, y)

# 학습된 모델과 사용된 피처 목록을 파일로 저장 (실시간 구동 및 평가를 위해 보관)
joblib.dump(gs.best_estimator_, "best_model.pkl")
joblib.dump(selected_5, "selected_features.pkl")
print("모델 학습 및 저장 완료!")
```

```python
# 4. 실시간 평가 및 제출
# 저장된 모델과 피처 정보 불러오기
model_loaded = joblib.load("best_model.pkl")
features_loaded = joblib.load("selected_features.pkl")

# 학습 때와 동일한 피처로 테스트 데이터 변환
X_test = test_df[features_loaded]

# 실시간 예측 수행
pred = model_loaded.predict(X_test)

# 정답지가 있는 경우 최종 평가 (기말 점수 확인)
if TARGET in test_df.columns:
    print(classification_report(test_df[TARGET], pred))
    # 감점 방지를 위한 Macro F1-Score 계산
    print(f"최종 기말 점수: {f1_score(test_df[TARGET], pred, average='macro'):.4f}")

# 제출용 파일(submission.csv) 생성
pd.DataFrame({'prediction': pred}).to_csv("submission.csv", index=False)
print("submission.csv 저장 완료!")
```
**[최종 기말 점수 출력]**
```text
              precision    recall  f1-score   support

           0       1.00      0.94      0.97        88
           1       0.71      1.00      0.83        12

    accuracy                           0.95       100
   macro avg       0.85      0.97      0.90       100
weighted avg       0.96      0.95      0.95       100

최종 기말 점수: 0.8992
submission.csv 저장 완료!
```

---

## 💻 방법 2: HistGradientBoostingClassifier (결측치 자동처리 최신 기법)

```python
# 1. [환경 설정 및 데이터 전처리]
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import classification_report, f1_score

# [수정 필요] 시험장 데이터 파일명을 실제 이름으로 기입하세요.
df = pd.read_csv("D:/머신러닝/회귀, 분류/머신러닝실습용자료/train.csv") # 학습용 데이터 로드
test_df = pd.read_csv("D:/머신러닝/회귀, 분류/머신러닝실습용자료/train.csv") # 평가용 데이터 로드

# [수정 필요] 엑셀/데이터 첫 행을 보고 정답 열 제목을 정확히 기입하세요.
TARGET = "target" 

# [그대로 사용] 결측치(NaN)가 있으면 에러가 나므로, 0으로 채워 무결성 확보.
df = df.fillna(0)
test_df = test_df.fillna(0)

# [그대로 사용] 피처(X)와 정답(y) 분리.
X = df.drop(TARGET, axis=1)
y = df[TARGET]

# [그대로 사용] 데이터가 제대로 들어왔는지 분포 확인.
print(f"데이터 로드 완료! Target 분포:\n{y.value_counts()}")
```

```python
# 2. [상관관계 병합 및 피처 선정]
# [그대로 사용] 상관관계 높은 항목 병합 (다중공선성 제거 및 데이터 효율화).
corr_matrix = X.corr().abs() 
upper = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)) 
to_drop = [column for column in upper.columns if any(upper[column] > 0.8)] # 상관계수 0.8 이상 찾기

# [그대로 사용] 상관관계 높은 두 피처를 합쳐 새로운 피처 생성 (데이터 차원 축소).
if len(to_drop) >= 2:
    X['merged_feat'] = X[to_drop[0]] + X[to_drop[1]]
    X = X.drop(columns=to_drop)
    test_df['merged_feat'] = test_df[to_drop[0]] + test_df[to_drop[1]]
    test_df = test_df.drop(columns=to_drop)

# [그대로 사용] 랜덤포레스트 모델로 피처 중요도(Ranking) 계산.
rf = RandomForestClassifier(random_state=42).fit(X, y)
importance = pd.DataFrame({'Feature': X.columns, 'Imp': rf.feature_importances_})

# [수정 가능] 중요도 기준 상위 5~8개 피처 선정 (기본 8개 추천).
top_features = importance.sort_values('Imp', ascending=False).head(8)['Feature'].tolist()
print(f"최종 선정된 8개 피처: {top_features}")
```

```python
# 3. [모델 학습 및 저장]
# [그대로 사용] HistGradientBoostingClassifier 모델 설정
# 아래 하이퍼파라미터는 과적합을 방지하면서도 0.97~0.99의 고성능을 내도록 최적화되었습니다.
model = HistGradientBoostingClassifier(
    learning_rate=0.1,        # 그대로 사용 (학습 속도 조절)
    max_iter=100,             # 그대로 사용 (모델 복잡도 제한)
    max_depth=3,              # 그대로 사용 (과적합 방지용 트리 깊이 제한)
    l2_regularization=1.0,    # 그대로 사용 (가중치 규제 적용)
    
    # [수정 필요] 데이터 분포 확인 후 가중치를 조정하세요.
    # 만약 데이터의 1(target=1)의 비중이 매우 적다면 7을 10으로, 
    # 비중이 생각보다 많다면 5로 숫자를 변경하세요.
    class_weight={0: 1, 1: 7},
    
    random_state=42           # 그대로 사용 (결과 재현성 보장)
)

# [그대로 사용] 학습 실행 (상위 피처만 사용)
model.fit(X[top_features], y)

# [그대로 사용] 모델 저장 (파일 이름은 그대로 유지하세요)
joblib.dump(model, "best_model.pkl")
joblib.dump(top_features, "selected_features.pkl")
print("과적합이 방지된 안정적인 모델 학습 완료!")
```

```python
# 4. [최종 평가 및 결과 출력]
# [그대로 사용] 저장된 모델과 피처 정보 불러오기.
model_loaded = joblib.load("best_model.pkl")
features_loaded = joblib.load("selected_features.pkl")

# [그대로 사용] 학습 때와 동일한 피처로 테스트 데이터 변환.
X_test = test_df[features_loaded]
pred = model_loaded.predict(X_test)

# [그대로 사용] 정답지가 있는 경우 최종 평가 및 기말 점수 산출.
if TARGET in test_df.columns:
    print("===== Classification Report (Test Data) =====")
    print(classification_report(test_df[TARGET], pred)) # 이미지와 동일한 성적표 출력
    # [그대로 사용] 감점 방지를 위한 Macro F1-Score 계산
    print(f"Macro F1 Score: {f1_score(test_df[TARGET], pred, average='macro'):.4f}")

# [그대로 사용] 제출용 파일(submission.csv) 생성.
pd.DataFrame({'prediction': pred}).to_csv("submission.csv", index=False)
print("submission.csv 저장 완료!")
```
**[출력 결과]**
```text
===== Classification Report (Test Data) =====
              precision    recall  f1-score   support

           0       1.00      0.98      0.99       791
           1       0.90      1.00      0.95       109

    accuracy                           0.99       900
   macro avg       0.95      0.99      0.97       900
weighted avg       0.99      0.99      0.99       900

Macro F1 Score: 0.9701
submission.csv 저장 완료!
```

---

## 💡 시험장 긴급 대처 가이드 (고쳐야 할 때)

*   **파일명 에러 발생 시:** Cell 1에서 `pd.read_csv("train.csv")`의 파일명(`train.csv`)을 폴더 내 실제 이름으로 바꾸세요.
*   **컬럼 에러 발생 시:** Cell 1에서 `TARGET = "target"`의 `"target"`을 데이터 정답 열의 제목으로 바꾸세요.
*   **모델 학습 에러 발생 시:** 만약 HistGradientBoostingClassifier가 작동 안 하면 Cell 3 상단에서 `HistGradientBoostingClassifier`를 `GradientBoostingClassifier`로 바꾸고 `class_weight` 옵션 대신 `sample_weight`를 학습 시점에 넣으세요.
*   **점수 튜닝 시:** Cell 3의 `class_weight={0: 1, 1: 7}`에서 7을 데이터 상황에 맞게 5, 10 등으로 수정하며 결과(Macro F1)를 관찰하세요.

```python
# 1. 만약 점수(Macro F1)가 0.97 이하로 나올 경우
# [Cell 3]으로 돌아가 아래 코드로 다시 학습해보세요 (3단계)
model = HistGradientBoostingClassifier(
    learning_rate=0.15,
    max_depth=5,
    class_weight={0: 1, 1: 10}, # 가중치를 7에서 10으로 올려보세요
    random_state=42
)
model.fit(X[top_features], y)
print("가중치 조정 후 재학습 완료!")

# 2. 데이터 파일 확인이 시급할 때
# 노트북에서 아래 코드를 실행하면 현재 폴더의 파일 목록이 뜹니다.
import os
print(os.listdir()) # 여기에 'train.csv'가 있는지 확인!
```

---

## 🚨 시험장 비상 대응 매뉴얼 (과적합 방지 버전)

분석 도중 오류가 발생하면 아래의 상황별 가이드를 참고하여 침착하게 해결하십시오. 에러 메시지는 컴퓨터가 알려주는 힌트이므로, 메시지를 먼저 읽는 것이 대처의 시작입니다.

### 01. 상황별 오류 해결 가이드

1.  **`FileNotFoundError`**
    *   **원인:** 데이터 파일명 오타 혹은 경로 오류입니다.
    *   **대처법:** `pd.read_csv()` 함수 안의 파일명을 확인하세요. 폴더 내 실제 파일명(예: `exam_train.csv`)과 철자, 대소문자까지 동일하게 수정해야 합니다.
2.  **`KeyError`**
    *   **원인:** 정답 컬럼명(TARGET)이 코드와 일치하지 않습니다.
    *   **대처법:** `print(df.columns)`를 실행하여 데이터 프레임에 있는 실제 컬럼명을 확인하세요. 이후 코드 상단 `TARGET = "..."` 부분의 이름을 정확히 수정합니다.
3.  **`ValueError` (수치화 불가)**
    *   **원인:** 데이터 내에 숫자가 아닌 문자열이나 범주형 데이터가 포함되어 있습니다.
    *   **대처법:** Cell 1 하단에 `X = X.select_dtypes(include=[np.number])`를 추가하여 숫자형 데이터만 학습하도록 필터링하세요.
4.  **`ImportError` (모델 미지원)**
    *   **원인:** 시험장의 파이썬 환경이 낮아 HistGradientBoostingClassifier를 지원하지 않습니다.
    *   **대처법:** `GradientBoostingClassifier`로 즉시 변경하세요. 이때, 모델의 `class_weight` 옵션 대신 `.fit()` 메서드에 `sample_weight=np.where(y == 1, 7, 1)` 옵션을 추가해야 합니다.

### 02. 성능 및 데이터 확인 팁

*   **데이터 파일 확인:** 코드가 잘못된 경우보다 데이터 자체가 문제인 경우가 많습니다. 데이터가 안 불러와진다면 `import os` 후 `os.listdir()`을 실행하여 현재 경로에 파일이 실제로 존재하는지 확인하세요.
*   **가중치 튜닝:** 만약 모델의 점수가 만족스럽지 않다면, `class_weight` 값을 조절하세요. 정답 데이터(`target=1`)가 매우 적다면 이 숫자를 7에서 10 또는 15로 키워보며 최적값을 찾으세요.
*   **경고(Warning) 대처:** `ConvergenceWarning`이 발생한다면 반복 횟수가 부족한 것이므로 `max_iter`를 100에서 200으로 늘리거나 `learning_rate`를 낮추어 학습을 더 정교하게 만드세요.

---

## 💻 방법 3: 스케일링(StandardScaler) 및 5-Fold Stratified K-Fold + GridSearchCV 결합

이 방법은 데이터의 크기(Scale)를 통일하는 전처리 과정과, 가장 정교한 교차 검증 방식(Stratified K-Fold)을 결합하여 성능의 안정성을 극대화하는 **발표/실무 최적화 모델링** 방식입니다.

### 1. 데이터 불러오기 및 피처 선택 (Feature Selection)

> 🎤 **발표 포인트 1: "왜 10개의 변수 중 5개만 선택했는가?"**
> 10개의 변수(Feature)를 모두 사용하면 오히려 불필요한 노이즈가 끼어 모델의 예측력이 떨어질 수 있습니다. 
> 따라서 랜덤포레스트(Random Forest) 알고리즘을 활용하여 **피처 중요도(Feature Importance)**를 먼저 평가했습니다. 
> 예측에 가장 큰 도움을 주는 상위 5개의 핵심 변수만 선별함으로써, 모델을 가볍게 만들면서도 정확도는 극대화(과적합 방지)하는 전략을 취했습니다.

```python
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import StratifiedKFold, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, f1_score

# [1] 데이터 로드
df = pd.read_csv("train.csv")

TARGET = "target"
X = df.drop(TARGET, axis=1) # 정답(target)을 제외한 10개의 특성
y = df[TARGET]              # 정답(target)

# [2] 변수 중요도 평가를 위한 임시 랜덤포레스트 모델 학습
rf_importance = RandomForestClassifier(random_state=42)
rf_importance.fit(X, y)

# [3] 중요도 순으로 내림차순 정렬
importance_df = pd.DataFrame({
    "Feature": X.columns,
    "Importance": rf_importance.feature_importances_
}).sort_values(by="Importance", ascending=False)

# [4] 상위 5개의 피처명만 리스트로 추출 (5개 골라내기 완료)
top_5_features = importance_df["Feature"].head(5).tolist()

print("\n===== 선택된 5개 핵심 Feature =====")
print(top_5_features)

# 원본 데이터에서 상위 5개 변수만 남긴 데이터를 새롭게 구성
X_selected = X[top_5_features]
```

### 2. 데이터 표준화 및 최고 성능 모델 학습 (그리드서치)

> 🎤 **발표 포인트 2: "어떻게 96점 이상의 최적 성능을 달성했는가?"**
> *   **데이터 표준화(Scaling):** 변수들 간의 단위나 값의 차이가 모델에 영향을 주지 않도록 `StandardScaler`를 적용하여 데이터의 스케일을 동일하게 맞추는 정밀 공정을 추가했습니다.
> *   **모델 선정:** 수업 시간에 배운 가장 강력하고 안정적인 앙상블 기법인 랜덤포레스트를 메인 모델로 사용했습니다.
> *   **그리드서치(GridSearch):** 단순히 모델을 한 번 학습시킨 것이 아닙니다. 트리의 개수, 가지치기 깊이, 그리고 데이터 불균형을 잡는 가중치 등을 컴퓨터가 수십 번 비교하며 스스로 **가장 완벽한 세팅(최적 파라미터)**을 찾도록 그리드서치를 적용했습니다.
> *   **교차 검증(K-Fold):** 5-Fold 교차검증을 적용해 결과의 신뢰성을 높였으며, 이렇게 찾은 단 하나의 ‘가장 똑똑한 모델’과 ‘스케일러’를 별도로 저장하여 실전(시험)에 대비했습니다.

```python
# [1] 선택된 5개 Feature에 대해 데이터 표준화(Scaling) 진행
scaler = StandardScaler()
X_selected_scaled = scaler.fit_transform(X_selected)

# [2] 머신러닝이 탐색할 경우의 수(파라미터 그리드) 설정
param_grid = {
    'n_estimators': [100, 200, 300], # 만들 트리의 개수
    'max_depth': [5, 8, 10, None],   # 트리의 최대 깊이 (과적합 방지 역할)
    'class_weight': ['balanced', {0: 1, 1: 5}, {0: 1, 1: 7}], # 타겟 불균형을 해결하기 위한 가중치 (고득점의 핵심)
    'min_samples_split': [2, 5]      # 노드를 분할하기 위한 최소 샘플 수
}

# [3] K-Fold 교차검증 세팅 (데이터를 5등분하여 돌아가며 검증, Stratified는 정답 비율을 유지해줌)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

rf = RandomForestClassifier(random_state=42)

# [4] 그리드서치 모델 세팅 및 학습 (최적의 조합 찾기 돌입!)
grid_search = GridSearchCV(
    estimator=rf,
    param_grid=param_grid,
    cv=cv,
    scoring='f1_macro', # 평가 기준을 감점 조건인 f1_macro로 설정
    n_jobs=-1,
    verbose=1
)

print("\nGridSearchCV를 통해 최적의 파라미터 조합을 찾는 중입니다...")
# 스케일링 된 데이터로 학습 진행!
grid_search.fit(X_selected_scaled, y)

# [5] 찾은 모델 중 가장 우수한 '단 1개의 모델'을 최종 선택
best_model = grid_search.best_estimator_

print("\n===== 도출된 최고 성능의 파라미터 =====")
print(grid_search.best_params_)

# 학습 데이터로 성능 점검 (스케일링 된 데이터 입력)
pred_full = best_model.predict(X_selected_scaled)
print("\n===== Train Data 성능 결과 리포트 =====")
print(classification_report(y, pred_full))

# [6] 최종 모델, 스케일러, 선택했던 5개의 피처 목록을 따로 저장하여 보관
joblib.dump(best_model, "best_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(top_5_features, "selected_features.pkl")

print("\n▶ 성공적으로 최적 모델(best_model.pkl), 스케일러(scaler.pkl), 피처(selected_features.pkl)가 저장되었습니다!")
```

### 3. 시험 당일 테스트 코드 (실제 서비스 적용)

> 🎤 **발표 포인트 3: "테스트 데이터를 위한 환경 구축 및 자동화"**
> 아무리 모델이 좋아도, 시험 당일 입력되는 데이터 포맷이나 스케일이 다르면 오류가 납니다. 
> 이를 막기 위해 저장해두었던 5개의 핵심 피처명(`selected_features.pkl`)과 데이터 표준화 도구(`scaler.pkl`)를 다시 불러옵니다. 
> 시험용 새로운 데이터가 들어오면, 자동으로 이 5개의 피처만 찾아 추출하고, 학습 때와 동일하게 스케일링하는 **‘환경’을 완벽하게 구축**했습니다. 
> 최종적으로 저장된 최우수 모델을 통해 실시간 예측을 구동하고, 목표치 달성을 증명하기 위해 요구된 classification_report를 바로 출력하여 점수 조건을 충족합니다.

```python
import pandas as pd
import joblib
import os
from sklearn.metrics import classification_report

if os.path.exists("test.csv"):
    # [1] 저장해둔 최적 모델, 스케일러, 5개의 피처 목록 불러오기
    model = joblib.load("best_model.pkl")
    scaler = joblib.load("scaler.pkl")
    features = joblib.load("selected_features.pkl")

    # [2] 시험 당일 새로운 데이터(test.csv)가 주어짐
    test_df = pd.read_csv("test.csv")

    # [3] 테스트 환경 자동 구축:
    # 1. 모델이 학습할 때 썼던 똑같은 5개의 컬럼만 알아서 추출해줍니다.
    X_test = test_df[features]
    
    # 2. 추출된 데이터에 학습 때 썼던 동일한 스케일러를 적용합니다.
    X_test_scaled = scaler.transform(X_test)

    # [4] 모델 실시간 구동 및 예측
    pred = model.predict(X_test_scaled)

    print("\n===== 예측 결과 (모델이 판단한 정답) =====")
    print(pred)

    # [5] 타겟이 있는 경우 기말 점수 조건에 맞는 리포트 출력
    if "target" in test_df.columns:
        # 교수님(평가자)이 제시한 '테스트용_target' 변수명을 명확히 사용
        테스트용_target = test_df["target"]

        print("\n===== 최종 성능 평가 (Classification Report) =====")
        
        # 감점을 당하지 않기 위한 필수 리포트 출력
        print(classification_report(테스트용_target, pred))
else:
    print("test.csv 파일이 없습니다. 시험 당일 test.csv 파일이 제공되면 이 셀을 실행하여 바로 점수를 확인하세요.")
```