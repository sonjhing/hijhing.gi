# 앙상블 랜덤 포레스트 (Ensemble Random Forest)

## 📌 랜덤 포레스트(Random Forest)란 무엇인가요?

**랜덤 포레스트**는 머신러닝의 **앙상블(Ensemble) 기법** 중 하나로, 쉽게 말해 **"여러 명의 전문가(의사결정나무)에게 의견을 묻고 다수결로 결정을 내리는 방식"**입니다. 
의사결정나무(Decision Tree) 한 그루만 사용하면 특정 데이터에만 과하게 맞춰지는 과적합(Overfitting) 현상이 발생하기 쉽습니다. 랜덤 포레스트는 훈련 데이터에서 무작위로 여러 개의 부분 집합을 만들어 수많은 의사결정나무(Tree)를 학습시키고(이를 숲, Forest라고 부름), 이들이 내놓은 결과를 종합하여 최종 예측을 수행합니다.

## 🎯 언제 사용할까요?

1. **높은 정확도가 필요할 때:** 단일 의사결정나무보다 예측력이 뛰어나고 안정적입니다.
2. **과적합(Overfitting)을 방지해야 할 때:** 여러 트리의 결과를 평균 내거나 다수결로 정하기 때문에 훈련 데이터에만 치우치는 현상을 효과적으로 줄여줍니다.
3. **어떤 특징(Feature)이 중요한지 알고 싶을 때:** 데이터의 여러 변수 중 어떤 것이 정답을 맞히는 데 가장 큰 영향을 미쳤는지(중요도)를 쉽게 확인할 수 있습니다.

---

## 💻 실습: 과일 및 채소 종류 분류하기

무게, 길이, 색상, 당도 데이터를 바탕으로 과일/채소의 종류(수박, 자두, 참외, 옥수수, 거봉포도)를 맞추는 랜덤 포레스트 분류 모델을 만들어 봅니다.

### Step 1. 구글 코랩에 한글 폰트 설정하기

그래프 출력 시 한글이 깨지는 것을 방지하기 위한 설정입니다.

```python
# 나눔 폰트를 설치합니다.
!sudo apt-get install -y fonts-nanum
# 설치된 폰트를 시스템에 적용합니다.
!sudo fc-cache -fv
# 기존 폰트 캐시를 지워서 새로운 폰트가 적용되게 합니다.
!rm ~/.cache/matplotlib -rf
```

---

### Step 2. 데이터 불러오기

```python
from google.colab import files
import io
import pandas as pd

# 파일을 업로드할 수 있는 창을 띄웁니다.
myfile = files.upload()

# 업로드한 '과일채소목록.csv' 파일을 판다스로 읽어옵니다. (cp949 인코딩 사용)
과일채소목록 = pd.read_csv(io.BytesIO(myfile['과일채소목록.csv']), encoding='cp949')

# 불러온 데이터를 화면에 출력하여 확인합니다.
과일채소목록
```

**[출력 결과 예시]**
```text
	종류	무게_g	길이_cm	색상	당도
0	수박	2000	30.0	1	8.0
1	수박	2500	25.0	1	7.0
2	수박	1800	20.0	1	6.5
3	수박	1500	16.0	1	8.5
4	수박	2200	21.0	1	9.5
5	자두	100	3.5	3	6.0
6	자두	120	3.7	3	7.0
7	자두	90	2.8	3	8.0
8	자두	150	3.8	3	8.5
9	자두	110	3.6	3	7.5
10	참외	500	8.0	2	8.0
11	참외	400	7.5	2	7.2
12	참외	450	8.0	2	7.5
13	참외	400	6.5	2	6.5
14	참외	600	8.5	2	8.0
15	옥수수	450	20.0	1	3.0
16	옥수수	500	25.0	1	2.0
17	옥수수	380	22.0	1	1.5
18	옥수수	400	23.0	1	1.0
19	옥수수	350	20.0	1	1.3
20	거봉포도	280	28.0	3	8.0
21	거봉포도	250	25.0	3	7.5
22	거봉포도	220	22.0	3	7.0
23	거봉포도	270	26.0	3	8.5
24	거봉포도	290	29.0	3	9.0
25	수박	2001	30.5	1	8.1
26	수박	2501	25.1	1	7.1
27	수박	1801	20.1	1	6.6
28	수박	1501	16.1	1	8.6
29	수박	2201	21.1	1	9.6
30	자두	101	3.6	3	6.1
31	자두	121	3.8	3	7.1
32	자두	91	2.9	3	8.1
33	자두	151	3.9	3	8.6
34	자두	111	3.7	3	7.6
35	참외	501	8.1	2	8.1
36	참외	401	7.6	2	7.3
37	참외	451	8.1	2	7.6
38	참외	401	6.6	2	6.6
39	참외	601	8.6	2	8.1
40	옥수수	451	20.1	1	3.1
41	옥수수	501	25.1	1	2.1
42	옥수수	381	22.1	1	1.6
43	옥수수	401	23.1	1	1.1
44	옥수수	351	20.1	1	1.4
45	거봉포도	281	28.1	3	8.1
46	거봉포도	251	25.1	3	7.6
47	거봉포도	221	22.1	3	7.1
48	거봉포도	271	26.1	3	8.6
49	거봉포도	291	29.1	3	9.1

```

---

## 로컬 데이터 로드
```python
from google.colab import drive
drive.mount('/content/drive')

#컴퓨터에서 작업하려면 아래 코드의 주석을 제거하고 실행하면 됩니다
import pandas as pd
src_data = pd.read_csv('/content/drive/MyDrive/Colab Notebooks/머신러닝 강의/머신러닝실습용자료/과일채소목록.csv',encoding='cp949')
src_data

```

## 위에 내용이랑 똑같이 나옴 
---

### Step 3. 훈련용 세트와 테스트용 세트로 나누기

```python
# 입력 데이터(Features): 무게, 길이, 색상, 당도 열만 추출합니다.
data = 과일채소목록[['무게_g','길이_cm','색상','당도']]

# 정답 데이터(Target): 예측하고자 하는 '종류' 열만 추출합니다.
target = 과일채소목록['종류']

from sklearn.model_selection import train_test_split

# 전체 데이터 중 20%(test_size=0.2)를 테스트용으로, 80%를 훈련용으로 분리합니다.
# random_state=40은 섞는 방식을 고정하여 매번 동일하게 나뉘도록 합니다.
훈련용_data, 테스트용_data, 훈련용_target, 테스트용_target = train_test_split(
    data, target, test_size = 0.2, random_state=40)

# 분리된 데이터의 크기(형태)를 확인합니다.
print(훈련용_data.shape , 테스트용_data.shape)

# 분리된 훈련 데이터를 출력해 봅니다.
print(훈련용_data)
print(훈련용_target)
```

**[출력 결과]**
```text
(35, 4) (15, 4)
    무게_g  길이_cm  색상   당도
41   501   25.1   1  2.1
23   270   26.0   3  8.5
36   401    7.6   2  7.3
5    100    3.5   3  6.0
13   400    6.5   2  6.5
39   601    8.6   2  8.1
17   380   22.0   1  1.5
43   401   23.1   1  1.1
24   290   29.0   3  9.0
3   1500   16.0   1  8.5
22   220   22.0   3  7.0
40   451   20.1   1  3.1
26  2501   25.1   1  7.1
34   111    3.7   3  7.6
20   280   28.0   3  8.0
28  1501   16.1   1  8.6
14   600    8.5   2  8.0
15   450   20.0   1  3.0
30   101    3.6   3  6.1
8    150    3.8   3  8.5
46   251   25.1   3  7.6
32    91    2.9   3  8.1
9    110    3.6   3  7.5
...
7       자두
27      수박
6       자두
Name: 종류, dtype: object
```

---

### Step 4. 랜덤 포레스트 모델 생성 및 학습

```python
from sklearn.ensemble import RandomForestClassifier

# 랜덤 포레스트 모델 객체를 생성합니다.
# n_estimators=10 : 숲을 구성할 의사결정나무(트리)의 개수를 10개로 설정합니다.
# n_jobs=1 : 학습에 사용할 CPU 코어 수 (1개 사용)
# random_state=40 : 결과를 일정하게 유지하기 위한 난수 고정
rf = RandomForestClassifier(n_estimators=10, n_jobs=1, random_state=40)

# 훈련용 데이터를 이용하여 모델을 학습시킵니다.
rf.fit(훈련용_data, 훈련용_target)

# 학습된 모델에 테스트용 데이터를 넣어 예측된 결과를 출력합니다.
print(rf.predict(테스트용_data))

# 테스트 데이터에 대한 정확도(score)를 확인합니다.
print(rf.score(테스트용_data, 테스트용_target))
```

**[출력 결과]**
```text
['자두' '수박' '거봉포도' '참외' '거봉포도' '수박' '옥수수' '수박' '참외' '수박' '옥수수' '참외' '수박'
 '거봉포도' '옥수수']
1.0
```

---

### Step 5. 예측 결과 비교용 데이터프레임 만들기

테스트 데이터와 모델이 예측한 결과를 한눈에 비교하기 위해 합쳐봅니다.

```python
# 기존 테스트 데이터를 확인해 봅니다.
테스트용_data

```

**[출력 결과]**
```text

	무게_g	길이_cm	색상	당도
33	151	3.9	3	8.6
29	2201	21.1	1	9.6
49	291	29.1	3	9.1
38	401	6.6	2	6.6
45	281	28.1	3	8.1
0	2000	30.0	1	8.0
18	400	23.0	1	1.0
4	2200	21.0	1	9.5
11	400	7.5	2	7.2
2	1800	20.0	1	6.5
16	500	25.0	1	2.0
35	501	8.1	2	8.1
25	2001	30.5	1	8.1
21	250	25.0	3	7.5
44	351	20.1	1	1.4
```


```python
# 모델이 테스트 데이터를 예측한 결과를 판다스 데이터프레임으로 만듭니다. (열 이름은 '예측결과')
예측결과 = pd.DataFrame(rf.predict(테스트용_data), columns=['예측결과'])

# 기존 테스트 데이터의 인덱스를 초기화(reset_index)하고, 예측결과 데이터프레임을 가로(axis=1)로 이어 붙입니다(concat).
result = pd.concat([테스트용_data.reset_index(drop=True), 예측결과], axis=1)

# 합쳐진 최종 결과를 출력하여 확인합니다.
result
```

**[출력 결과]**
```text

무게_g	길이_cm	색상	당도	예측결과
0	151	3.9	3	8.6	자두
1	2201	21.1	1	9.6	수박
2	291	29.1	3	9.1	거봉포도
3	401	6.6	2	6.6	참외
4	281	28.1	3	8.1	거봉포도
5	2000	30.0	1	8.0	수박
6	400	23.0	1	1.0	옥수수
7	2200	21.0	1	9.5	수박
8	400	7.5	2	7.2	참외
9	1800	20.0	1	6.5	수박
10	500	25.0	1	2.0	옥수수
11	501	8.1	2	8.1	참외
12	2001	30.5	1	8.1	수박
13	250	25.0	3	7.5	거봉포도
14	351	20.1	1	1.4	옥수수

```

---

### 방법1 Step 6. 분류 리포트 출력 (필수 확인 지표) - 1

모델의 성능을 종합적으로 판단하기 위해 정밀도, 재현율, F1 스코어 등을 출력합니다.

```python
# scikit-learn 라이브러리에서 분류 성능 리포트 함수를 가져옵니다. (오타 수정: classification_report)
from sklearn.metrics import classification_report

# 테스트 데이터에 대한 예측값을 다시 구합니다.
pred = rf.predict(테스트용_data)

# 실제 정답(테스트용_target)과 예측값(pred)을 비교하여 상세 성능 리포트를 출력합니다.
print(classification_report(테스트용_target, pred))
```

---

### Step 7. K-Fold 교차 검증 적용

데이터 부족으로 인한 '성능 뻥튀기(과적합)'를 막기 위해 교차 검증을 수행합니다. 
데이터를 여러 조각으로 쪼개서 번갈아가며 시험을 치르는 방식입니다.

**[교차 검증(K-Fold) 시각화 예시 (5-Fold)]**
```text
전체 데이터 조각 (5개로 나누었다고 가정)
|----------------------------------|
| 학습용 | 학습용 | 학습용 | 학습용 | 검증용 | (1회차)
| 학습용 | 학습용 | 학습용 | 검증용 | 학습용 | (2회차)
| 학습용 | 학습용 | 검증용 | 학습용 | 학습용 | (3회차)
| 학습용 | 검증용 | 학습용 | 학습용 | 학습용 | (4회차)
| 검증용 | 학습용 | 학습용 | 학습용 | 학습용 | (5회차)
```
이렇게 골고루 모든 데이터가 한 번씩은 검증용(시험문제)으로 사용되게 하여 모델의 '진짜 실력'을 평가합니다.

```python
import numpy as np
from sklearn.model_selection import cross_validate

# 앞서 만든 rf (랜덤 포레스트) 모델을 교차 검증합니다.
# return_train_score=True : 테스트 점수뿐만 아니라 학습에 사용된 훈련 점수도 함께 반환하도록 합니다.
# n_jobs=-1 : 컴퓨터의 모든 CPU 코어를 동원하여 병렬로 빠르게 연산하라는 의미입니다.
scores = cross_validate(rf, 훈련용_data, 훈련용_target, return_train_score=True, n_jobs=-1)

# 교차 검증된 훈련 점수의 평균과 테스트 점수의 평균을 차례대로 출력합니다.
print(np.mean(scores['train_score']), np.mean(scores['test_score']))
```

**[출력 결과]**
```text
1.0 1.0
```

---

### Step 8. 피처 중요도(Feature Importances) 확인 및 시각화

랜덤 포레스트의 가장 큰 장점 중 하나인 "어떤 속성(Feature)이 예측에 가장 중요한 영향을 미쳤는가?"를 확인합니다.

```python
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import matplotlib

# 로컬(윈도우) 환경에서 실행할 경우 한글 폰트 경로를 설정합니다.
font_location = "C:/Windows/Fonts/malgun.ttf"
# 코랩 환경이라면 이 코드를 씁니다: plt.rc('font', family='NanumBarunGothic')

# 모델이 학습을 마치면 feature_importances_ 속성에 각 특성(무게, 길이, 색상, 당도)의 중요도가 저장됩니다.
imp = rf.feature_importances_
print('중요속성지표값:', imp)

# 그래프(Figure)를 생성합니다.
plt.figure()

# 막대 그래프(bar)를 그립니다. X축은 특성의 개수(0~3), Y축은 각 특성의 중요도 값(imp)입니다.
plt.bar(range(len(imp)), imp)

# X축 눈금(ticks)의 라벨을 '무게_g', '길이_cm', '색상', '당도'로 설정하고, 글자가 겹치지 않게 90도 회전시킵니다.
plt.xticks(range(len(imp)), data.columns, rotation=90)

# 폰트 에러 발생 시, 위에서 설정한 윈도우 폰트를 적용하는 코드입니다.
font_name = fm.FontProperties(fname=font_location).get_name()
matplotlib.rc('font', family=font_name)

# 그래프를 화면에 보여줍니다.
plt.show()
```

**[출력 결과]**
```text
중요속성지표값: [0.43788379 0.18804429 0.15510803 0.21896389]
```
*(결과 해석: 첫 번째 특성인 '무게_g'(약 43.7%)가 과일과 채소를 분류하는 데 가장 중요한 기준이 되었음을 의미합니다.)*

---

## 📌 방법 2: 분류 리포트 및 교차 검증 (다른 환경/방식 적용)

앞서 진행한 방법과는 다른 방식으로 코드를 작성한 버전입니다. (동일한 결과를 내지만 코랩/로컬 환경 설정이나 코드 작성 방식에 차이가 있습니다.)

### 방법2 Step 6. 분류 리포트 출력 (필수 확인 지표) - 1

```python
"""
교차 검증(K-Fold) 시각화:
데이터를 5조각으로 나누어 번갈아가며 시험(검증)을 봅니다.
|----------------------------------|
|------|------|------|------|검증용|
|------|------|------|검증용|------|
|------|------|검증용|------|------|
|------|검증용|------|------|------|
|검증용|------|------|------|------|
"""

# 예측결과 데이터프레임을 만들고 (테스트 데이터를 넣고 예측한 결과를 데이터프레임으로 변환)
예측결과 = pd.DataFrame(rf.predict(테스트용_data), columns=['예측결과'])

# concat을 통해 기존 테스트 data와 예측결과 데이터를 합친다. (인덱스를 초기화하여 가로로 붙임)
result = pd.concat([테스트용_data.reset_index(drop=True), 예측결과], axis=1)


# k-fold 교차 검증 (모델의 객관적인 성능 평가)
import numpy as np
from sklearn.model_selection import cross_validate

# rf = randomforest모델
# return_train_score=True -> 학습시 score점수를 누적해서 반환 (훈련 점수도 같이 보겠다는 뜻)
# n_jobs : 동시에 실행되는 갯수 : -1 자동 지정 (모든 CPU 코어 사용)
scores = cross_validate(rf , 훈련용_data , 훈련용_target,
                       return_train_score=True , n_jobs=-1)

# 훈련 점수의 평균과 테스트 점수의 평균을 차례대로 출력합니다.
print(np.mean(scores['train_score']), np.mean(scores['test_score']))

# 결과
# 1.0 1.0
```

---

### 방법2 Step 7. 중요 속성 지표값 출력 (코랩 환경용)

```python
# 중요 속성 지표값 출력 (어떤 데이터가 정답을 맞추는 데 가장 큰 역할을 했는지 확인)
import matplotlib.pyplot as plt

# 코랩 환경에서 한글 깨짐을 방지하기 위한 폰트 설정
plt.rc('font', family='NanumBarunGothic')

# 랜덤포레스트를 학습시키면 feature_importances_가 나옴. (각 특성의 기여도)
imp = rf.feature_importances_
print('중요속성지표값:',imp)

# 막대 그래프를 생성하여 중요도를 시각화합니다.
plt.figure()
plt.bar(range(len(imp)),imp)
plt.xticks(range(len(imp)),data.columns, rotation=90) # X축에 특성 이름 출력 및 90도 회전
plt.show()
```

---

### 방법2 Step 8. 중요 속성 지표값 출력 (로컬 노트북/윈도우 환경용)

```python
# 코랩이 아닌 노트북에서 실행할 경우 아래 내용을 실행하면 됩니다
from matplotlib import pyplot as plt
import matplotlib.font_manager as fm
import matplotlib

# 로컬 PC(윈도우)의 폰트 경로를 직접 지정합니다.
font_location = "c:\windows\Fonts\HYCYSM.TTF"
# 혹시 위 폰트가 에러날 경우 C:\\Windows\\Fonts\\malgun.ttf" 폰트 사용하면 됩니다

# 폰트 매니저를 통해 해당 폰트의 이름을 가져와서 matplotlib에 적용합니다.
font_name = fm.FontProperties(fname = font_location).get_name()
matplotlib.rc('font' , family=font_name)

# 랜덤포레스트의 속성 중요도를 가져와서 출력합니다.
imp = rf.feature_importances_
print('중요속성지표값:',imp)

# 그래프 그리기
plt.figure()
plt.bar(range(len(imp)),imp)
plt.xticks(range(len(imp)),data.columns, rotation=90)
plt.show()
```


