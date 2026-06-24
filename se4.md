# 🚀 기말고사 대비 기본 매뉴얼 및 에러 해결법 (se4)

이 문서는 시험장에서 발생할 수 있는 주요 에러 상황에 대한 해결책과, 분류 문제에서 가장 기본적으로 높은 점수를 얻을 수 있는 **랜덤 포레스트(Random Forest)** 기반의 피처 중요도 분석 및 그리드 서치(최적화) 코드를 담고 있습니다.

## 📌 왜 이 코드를 사용하나요?
1. **분류 문제의 정석:** 어떤 데이터를 만나든 가장 무난하고 높은 정확도를 자랑하는 랜덤 포레스트를 사용합니다.
2. **피처 중요도(Feature Importance):** 수많은 데이터 중 진짜 중요한 5개만 골라서 빠르고 정확하게 학습하는 실무 최적화 기법입니다.
3. **불균형 데이터 해결:** 데이터 비율이 맞지 않을 때 `class_weight` 속성을 부여하여 억울하게 점수가 깎이는 현상을 방지합니다.

---

## 💻 1. 라이브러리 및 데이터 불러오기

```python
# 분석에 필요한 주요 라이브러리를 임포트하고, 시험 데이터를 로드하여 기본적인 형태를 확인한다.
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import classification_report, f1_score

# [수정 1] 실제 시험장 파일명으로 바꾸세요!
df = pd.read_csv("D:/머신러닝/회귀, 분류/머신러닝실습용자료/train.csv") 
test_df = pd.read_csv("D:/머신러닝/회귀, 분류/머신러닝실습용자료/test.csv")

# [수정 2] 정답(Target) 열 이름으로 바꾸세요! (엑셀 파일 1열 확인)
TARGET = "target" 

# X(피처)와 y(정답) 분리
X = df.drop(TARGET, axis=1)
y = df[TARGET]

# 데이터가 제대로 들어왔는지 출력하여 확인합니다.
print(f"데이터 로드 완료! X shape: {X.shape}, y shape: {y.shape}")
print(f"Target 분포 확인:\n{y.value_counts()}")
```
**[출력 결과]**
```text
데이터 로드 완료! X shape: (900, 10), y shape: (900,)
Target 분포 확인:
target
0    791
1    109
Name: count, dtype: int64
```

---

## 💻 2. 피처 중요도 분석

```python
# 랜덤 포레스트 모델을 먼저 가볍게 학습시켜 어떤 특성(피처)이 가장 중요한지 찾아냅니다.
import matplotlib.pyplot as plt

# 중요도 계산을 위한 초기 모델 학습
rf = RandomForestClassifier(random_state=42).fit(X, y)
importance = pd.DataFrame({'Feature': X.columns, 'Imp': rf.feature_importances_})

# [수정 3] 피처 개수 조절 (가장 중요한 상위 5개만 뽑습니다. 8개를 쓰고 싶다면 head(8)로 변경)
selected = importance.sort_values('Imp', ascending=False).head(5)['Feature'].tolist()

# 중요도를 시각화하여 막대그래프로 나타냅니다.
importance.sort_values('Imp', ascending=True).tail(5).plot(kind='barh', x='Feature', y='Imp', color='teal')
plt.title("Top 5 Feature Importance")
plt.show()

print(f"선택된 핵심 피처: {selected}")
```
**[출력 결과]**
```text
선택된 핵심 피처: ['feat_8', 'feat_4', 'feat_7', 'feat_6', 'feat_9']
```

---

## 💻 3. 모델 학습 및 최적화

```python
# 데이터 불균형 문제를 해결하기 위해 class_weight를 설정하고, GridSearchCV로 최적의 설정을 찾습니다.

# [수정 4] 클래스 불균형 방지. 1을 맞추는 게 중요하다면 7을 5, 8, 10으로 늘려가며 테스트해 보세요.
model = RandomForestClassifier(random_state=42, class_weight={0: 1, 1: 7}) 

# 컴퓨터가 알아서 가장 좋은 옵션을 찾아줄 파라미터 조합 리스트
params = {'n_estimators': [50, 100], 'max_depth': [3, 5]}

# 방금 전 2번 단계에서 뽑은 '가장 중요한 5개의 피처'만 잘라내서 학습 데이터를 만듭니다.
X_selected = X[selected]

# 모델 튜닝 (cv=5는 데이터를 5개로 쪼개어 교차 검증한다는 뜻입니다.)
gs = GridSearchCV(model, params, scoring='f1_macro', cv=5).fit(X_selected, y)

# 가장 성적이 좋은 모델과, 사용된 핵심 피처 정보를 컴퓨터(파일)에 저장해 둡니다.
joblib.dump(gs.best_estimator_, "best_model.pkl")
joblib.dump(selected, "selected_features.pkl")
print(f"학습 완료! 최적 파라미터: {gs.best_params_}")
```
**[출력 결과]**
```text
학습 완료! 최적 파라미터: {'max_depth': 5, 'n_estimators': 100}
```

---

## 💻 4. 최종 결과 검증 및 제출

```python
# [Cell 4: 최종 결과 검증 및 제출]
import pandas as pd
import joblib
from sklearn.metrics import classification_report, f1_score

# 1. 저장된 최고 모델과 피처(특성) 정보 불러오기
model_loaded = joblib.load("best_model.pkl")
features_loaded = joblib.load("selected_features.pkl")

# [수정 필요] 2. 평가용 데이터 로드 (파일 이름 확인 후 수정)
# test_df = pd.read_csv("exam_test_0624.csv") 처럼 실제 파일명으로 수정하세요.
test_df = pd.read_csv("test.csv")

# 3. 테스트 데이터 준비 (학습 때와 완벽히 동일한 5개의 피처만 사용)
X_test = test_df[features_loaded]

# 4. 실시간 예측 수행
pred = model_loaded.predict(X_test)

# 5. 최종 결과 출력 및 검증 (교수님이 확인하시는 기말고사 채점 방식)
# 데이터 안에 "target"(정답)이 있다면 채점을 진행합니다.
# [수정 필요] 만약 시험지 데이터의 정답 열 제목이 다르다면 "target"을 그 이름으로 바꾸세요!
if "target" in test_df.columns:
    print("===== Classification Report (Test Data) =====")
    
    y_test = test_df["target"]
    print(classification_report(y_test, pred))
    
    # 기말고사 점수 조건: Macro Avg F1-Score를 반드시 산출
    test_f1 = f1_score(y_test, pred, average='macro')
    print(f"최종 기말 점수 (Macro F1): {test_f1:.4f}")
else:
    print("정답 컬럼(target)이 없습니다. 예측값(pred)만 생성되었습니다.")

# 6. 최종 제출용 파일(submission.csv) 생성
submission = pd.DataFrame({'prediction': pred})
submission.to_csv("submission.csv", index=False)
print("\n[완료] 결과 파일 'submission.csv'가 저장되었습니다.")
```
**[출력 결과]**
```text
===== Classification Report (Test Data) =====
              precision    recall  f1-score   support

           0       1.00      0.94      0.97        88
           1       0.71      1.00      0.83        12

    accuracy                           0.95       100
   macro avg       0.85      0.97      0.90       100
weighted avg       0.96      0.95      0.95       100

최종 기말 점수 (Macro F1): 0.8992

[완료] 결과 파일 'submission.csv'가 저장되었습니다.
```

---

## 🚨 시험장 에러 해결 상세 매뉴얼

### 1. 에러: `FileNotFoundError` (파일을 찾을 수 없음)
*   **원인:** 코드에 적힌 `train.csv`라는 이름의 파일이 현재 폴더에 없습니다.
*   **자세한 대처법:**
    1. 노트북에 새로운 코드 셀을 만들고 `import os; print(os.listdir())`를 실행하세요.
    2. 출력된 파일 목록 중에서 데이터 파일의 실제 이름을 확인합니다 (예: `exam_data.csv`).
    3. 코드 상단 `pd.read_csv("train.csv")` 부분을 `pd.read_csv("확인한파일명.csv")`로 정확하게 수정하세요.

### 2. 에러: `KeyError: 'target'` (정답 열을 찾을 수 없음)
*   **원인:** 데이터셋의 정답(Target) 열 이름이 `target`이 아닌 다른 이름입니다.
*   **자세한 대처법:**
    1. 코드 셀에 `print(df.columns)`를 입력해 전체 열 제목을 확인하세요.
    2. 정답 데이터가 무엇인지(예: `label`, `class`, `is_fraud`) 목록에서 찾습니다.
    3. `TARGET = "target"` 부분을 `TARGET = "실제찾은컬럼명"`으로 변경하세요.

### 3. 에러: `ValueError: Input contains NaN` (빈 값 존재)
*   **원인:** 데이터 어딘가에 빈 칸(NaN)이 있어 모델이 학습을 못 하는 상태입니다.
*   **자세한 대처법:**
    1. 데이터 로드 직후, 빈 값을 0으로 채워주는 아래 코드를 추가하세요.
        ```python
        df = df.fillna(0) 
        test_df = test_df.fillna(0)
        ```
    2. `print(df.isnull().sum())`으로 빈 값이 0이 되었는지 확인 후 다시 실행하세요.

### 4. 에러: `NameError` (변수 정의 안 됨)
*   **원인:** 셀을 순서대로 실행하지 않았거나, 변수명을 오타 냈을 때 발생합니다.
*   **자세한 대처법:** 주피터 노트북 상단 메뉴의 `[Kernel]` → `[Restart & Run All]`을 클릭하세요. 맨 위 셀부터 끝까지 순서대로 다시 실행되어 모든 변수가 메모리에 로드됩니다.

### 5. 점수가 너무 낮을 때 (Macro F1 최적화)
*   **원인:** 클래스 불균형이 해결되지 않아 모델이 소수 클래스를 포기했습니다.
*   **자세한 대처법:** `class_weight={0: 1, 1: 7}` 부분의 가중치 수치를 변경하세요. 7 대신 5, 8, 10 등 숫자를 바꿔가며 다시 학습(Shift+Enter)해보세요. 점수가 가장 높게 나오는 숫자가 이번 데이터의 정답입니다.

### 💡 시험 당일 '컬럼 자동 확인' 꿀팁
코드 최상단에 아래 코드를 한 줄 추가해서 실행하면, 고민할 필요 없이 정답 컬럼명을 바로 알 수 있습니다.
```python
# 코드 상단에 추가하여 실행하면 전체 컬럼명을 리스트로 알려줍니다.
print("이 데이터의 컬럼 목록입니다:", list(df.columns))
```