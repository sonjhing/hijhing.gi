# Google Colab 데이터 로드


```python
#Step 1. 구글 코랩에 한글 폰트 설정하기

!sudo apt-get install -y fonts-nanum
!sudo fc-cache -fv
!rm ~/.cache/matplotlib -rf
```


```python
#Step 2.분석할 데이터가 저장된 파일을 불러와서 변수에 할당합니다.
from google.colab import files
myfile = files.upload()
import io
import pandas as pd
#pd.read_csv로 csv파일 불러오기
과일채소목록 = pd.read_csv(io.BytesIO(myfile['과일채소목록.csv']),
                       encoding='cp949')
과일채소목록
```
    ---------------------------------------------------------------------------

# 로컬 데이터 로드


```python
#컴퓨터에서 작업하려면 아래 코드의 주석을 제거하고 실행하면 됩니다
import pandas as pd
src_data = pd.read_csv('../머신러닝실습용자료/과일채소목록.csv',encoding='cp949')
src_data
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>종류</th>
      <th>무게_g</th>
      <th>길이_cm</th>
      <th>색상</th>
      <th>당도</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>수박</td>
      <td>2000</td>
      <td>30.0</td>
      <td>1</td>
      <td>8.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>수박</td>
      <td>2500</td>
      <td>25.0</td>
      <td>1</td>
      <td>7.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>수박</td>
      <td>1800</td>
      <td>20.0</td>
      <td>1</td>
      <td>6.5</td>
    </tr>
    <tr>
      <th>3</th>
      <td>수박</td>
      <td>1500</td>
      <td>16.0</td>
      <td>1</td>
      <td>8.5</td>
    </tr>
    <tr>
      <th>4</th>
      <td>수박</td>
      <td>2200</td>
      <td>21.0</td>
      <td>1</td>
      <td>9.5</td>
    </tr>
    <tr>
      <th>5</th>
      <td>자두</td>
      <td>100</td>
      <td>3.5</td>
      <td>3</td>
      <td>6.0</td>
    </tr>
    <tr>
      <th>6</th>
      <td>자두</td>
      <td>120</td>
      <td>3.7</td>
      <td>3</td>
      <td>7.0</td>
    </tr>
    <tr>
      <th>7</th>
      <td>자두</td>
      <td>90</td>
      <td>2.8</td>
      <td>3</td>
      <td>8.0</td>
    </tr>
    <tr>
      <th>8</th>
      <td>자두</td>
      <td>150</td>
      <td>3.8</td>
      <td>3</td>
      <td>8.5</td>
    </tr>
    <tr>
      <th>9</th>
      <td>자두</td>
      <td>110</td>
      <td>3.6</td>
      <td>3</td>
      <td>7.5</td>
    </tr>
    <tr>
      <th>10</th>
      <td>참외</td>
      <td>500</td>
      <td>8.0</td>
      <td>2</td>
      <td>8.0</td>
    </tr>
    <tr>
      <th>11</th>
      <td>참외</td>
      <td>400</td>
      <td>7.5</td>
      <td>2</td>
      <td>7.2</td>
    </tr>
    <tr>
      <th>12</th>
      <td>참외</td>
      <td>450</td>
      <td>8.0</td>
      <td>2</td>
      <td>7.5</td>
    </tr>
    <tr>
      <th>13</th>
      <td>참외</td>
      <td>400</td>
      <td>6.5</td>
      <td>2</td>
      <td>6.5</td>
    </tr>
    <tr>
      <th>14</th>
      <td>참외</td>
      <td>600</td>
      <td>8.5</td>
      <td>2</td>
      <td>8.0</td>
    </tr>
    <tr>
      <th>15</th>
      <td>옥수수</td>
      <td>450</td>
      <td>20.0</td>
      <td>1</td>
      <td>3.0</td>
    </tr>
    <tr>
      <th>16</th>
      <td>옥수수</td>
      <td>500</td>
      <td>25.0</td>
      <td>1</td>
      <td>2.0</td>
    </tr>
    <tr>
      <th>17</th>
      <td>옥수수</td>
      <td>380</td>
      <td>22.0</td>
      <td>1</td>
      <td>1.5</td>
    </tr>
    <tr>
      <th>18</th>
      <td>옥수수</td>
      <td>400</td>
      <td>23.0</td>
      <td>1</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>19</th>
      <td>옥수수</td>
      <td>350</td>
      <td>20.0</td>
      <td>1</td>
      <td>1.3</td>
    </tr>
    <tr>
      <th>20</th>
      <td>거봉포도</td>
      <td>280</td>
      <td>28.0</td>
      <td>3</td>
      <td>8.0</td>
    </tr>
    <tr>
      <th>21</th>
      <td>거봉포도</td>
      <td>250</td>
      <td>25.0</td>
      <td>3</td>
      <td>7.5</td>
    </tr>
    <tr>
      <th>22</th>
      <td>거봉포도</td>
      <td>220</td>
      <td>22.0</td>
      <td>3</td>
      <td>7.0</td>
    </tr>
    <tr>
      <th>23</th>
      <td>거봉포도</td>
      <td>270</td>
      <td>26.0</td>
      <td>3</td>
      <td>8.5</td>
    </tr>
    <tr>
      <th>24</th>
      <td>거봉포도</td>
      <td>290</td>
      <td>29.0</td>
      <td>3</td>
      <td>9.0</td>
    </tr>
    <tr>
      <th>25</th>
      <td>수박</td>
      <td>2001</td>
      <td>30.5</td>
      <td>1</td>
      <td>8.1</td>
    </tr>
    <tr>
      <th>26</th>
      <td>수박</td>
      <td>2501</td>
      <td>25.1</td>
      <td>1</td>
      <td>7.1</td>
    </tr>
    <tr>
      <th>27</th>
      <td>수박</td>
      <td>1801</td>
      <td>20.1</td>
      <td>1</td>
      <td>6.6</td>
    </tr>
    <tr>
      <th>28</th>
      <td>수박</td>
      <td>1501</td>
      <td>16.1</td>
      <td>1</td>
      <td>8.6</td>
    </tr>
    <tr>
      <th>29</th>
      <td>수박</td>
      <td>2201</td>
      <td>21.1</td>
      <td>1</td>
      <td>9.6</td>
    </tr>
    <tr>
      <th>30</th>
      <td>자두</td>
      <td>101</td>
      <td>3.6</td>
      <td>3</td>
      <td>6.1</td>
    </tr>
    <tr>
      <th>31</th>
      <td>자두</td>
      <td>121</td>
      <td>3.8</td>
      <td>3</td>
      <td>7.1</td>
    </tr>
    <tr>
      <th>32</th>
      <td>자두</td>
      <td>91</td>
      <td>2.9</td>
      <td>3</td>
      <td>8.1</td>
    </tr>
    <tr>
      <th>33</th>
      <td>자두</td>
      <td>151</td>
      <td>3.9</td>
      <td>3</td>
      <td>8.6</td>
    </tr>
    <tr>
      <th>34</th>
      <td>자두</td>
      <td>111</td>
      <td>3.7</td>
      <td>3</td>
      <td>7.6</td>
    </tr>
    <tr>
      <th>35</th>
      <td>참외</td>
      <td>501</td>
      <td>8.1</td>
      <td>2</td>
      <td>8.1</td>
    </tr>
    <tr>
      <th>36</th>
      <td>참외</td>
      <td>401</td>
      <td>7.6</td>
      <td>2</td>
      <td>7.3</td>
    </tr>
    <tr>
      <th>37</th>
      <td>참외</td>
      <td>451</td>
      <td>8.1</td>
      <td>2</td>
      <td>7.6</td>
    </tr>
    <tr>
      <th>38</th>
      <td>참외</td>
      <td>401</td>
      <td>6.6</td>
      <td>2</td>
      <td>6.6</td>
    </tr>
    <tr>
      <th>39</th>
      <td>참외</td>
      <td>601</td>
      <td>8.6</td>
      <td>2</td>
      <td>8.1</td>
    </tr>
    <tr>
      <th>40</th>
      <td>옥수수</td>
      <td>451</td>
      <td>20.1</td>
      <td>1</td>
      <td>3.1</td>
    </tr>
    <tr>
      <th>41</th>
      <td>옥수수</td>
      <td>501</td>
      <td>25.1</td>
      <td>1</td>
      <td>2.1</td>
    </tr>
    <tr>
      <th>42</th>
      <td>옥수수</td>
      <td>381</td>
      <td>22.1</td>
      <td>1</td>
      <td>1.6</td>
    </tr>
    <tr>
      <th>43</th>
      <td>옥수수</td>
      <td>401</td>
      <td>23.1</td>
      <td>1</td>
      <td>1.1</td>
    </tr>
    <tr>
      <th>44</th>
      <td>옥수수</td>
      <td>351</td>
      <td>20.1</td>
      <td>1</td>
      <td>1.4</td>
    </tr>
    <tr>
      <th>45</th>
      <td>거봉포도</td>
      <td>281</td>
      <td>28.1</td>
      <td>3</td>
      <td>8.1</td>
    </tr>
    <tr>
      <th>46</th>
      <td>거봉포도</td>
      <td>251</td>
      <td>25.1</td>
      <td>3</td>
      <td>7.6</td>
    </tr>
    <tr>
      <th>47</th>
      <td>거봉포도</td>
      <td>221</td>
      <td>22.1</td>
      <td>3</td>
      <td>7.1</td>
    </tr>
    <tr>
      <th>48</th>
      <td>거봉포도</td>
      <td>271</td>
      <td>26.1</td>
      <td>3</td>
      <td>8.6</td>
    </tr>
    <tr>
      <th>49</th>
      <td>거봉포도</td>
      <td>291</td>
      <td>29.1</td>
      <td>3</td>
      <td>9.1</td>
    </tr>
  </tbody>
</table>
</div>



# 공통 실습 코드


```python
#Step 3. 훈련용 세트와 테스트용 세트로 나눕니다.
import numpy as np
# '무게_g','길이_cm','색상','당도'에 따른 과일종류 분류
data =src_data[['무게_g','길이_cm','색상','당도']]    
target = src_data['종류']

# train, test 데이터 분리
from sklearn.model_selection import train_test_split
훈련용_data, 테스트용_data, 훈련용_target, 테스트용_target = train_test_split(
    data, target, test_size = 0.2, random_state=40)

```


```python
# 각각의 데이터 확인
print(훈련용_data.shape , 테스트용_data.shape)
print(훈련용_data)
print(훈련용_target)
```

    (40, 4) (10, 4)
        무게_g  길이_cm  색상   당도
    16   500   25.0   1  2.0
    35   501    8.1   2  8.1
    25  2001   30.5   1  8.1
    21   250   25.0   3  7.5
    44   351   20.1   1  1.4
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
    48   271   26.1   3  8.6
    42   381   22.1   1  1.6
    10   500    8.0   2  8.0
    31   121    3.8   3  7.1
    19   350   20.0   1  1.3
    47   221   22.1   3  7.1
    12   450    8.0   2  7.5
    1   2500   25.0   1  7.0
    37   451    8.1   2  7.6
    7     90    2.8   3  8.0
    27  1801   20.1   1  6.6
    6    120    3.7   3  7.0
    16     옥수수
    35      참외
    25      수박
    21    거봉포도
    44     옥수수
    41     옥수수
    23    거봉포도
    36      참외
    5       자두
    13      참외
    39      참외
    17     옥수수
    43     옥수수
    24    거봉포도
    3       수박
    22    거봉포도
    40     옥수수
    26      수박
    34      자두
    20    거봉포도
    28      수박
    14      참외
    15     옥수수
    30      자두
    8       자두
    46    거봉포도
    32      자두
    9       자두
    48    거봉포도
    42     옥수수
    10      참외
    31      자두
    19     옥수수
    47    거봉포도
    12      참외
    1       수박
    37      참외
    7       자두
    27      수박
    6       자두
    Name: 종류, dtype: str
    


```python
from sklearn.ensemble import RandomForestClassifier
# 랜덤 포레스트 모델 생성
rf = RandomForestClassifier(n_estimators=10 , n_jobs=-1, random_state=40)

# 학습
rf.fit(훈련용_data, 훈련용_target)

# 예측
rf.predict(테스트용_data)

# score
rf.score(테스트용_data, 테스트용_target)
```

    1.0


### 결과표 작성 및 시각화


```python
# 테스트 데이터 확인
rf
```


    ---------------------------------------------------------------------------


    ---------------------------------------------------------------------------



```python
# 이걱 시험 ㅠㅠㅠ
from sklearn.metrics import classification_reports

# 예측
pred = rf.predict(테스트용_data)

classification_reports(테스트용_target, pred)
```


    ---------------------------------------------------------------------------

    ImportError                               Traceback (most recent call last)

    Cell In[21], line 2
          1 # 이걱 시험 ㅠㅠㅠ
    ----> 2 from sklearn.metrics import classification_reports
          4 # 예측
          5 pred = rf.predict(테스트용_data)
    

    ImportError: cannot import name 'classification_reports' from 'sklearn.metrics' (c:\Users\user\AppData\Local\Programs\Python\Python313\Lib\site-packages\sklearn\metrics\__init__.py)



```python
# 예측결과 데이터프레임을 만들고
예측결과 = pd.DataFrame(rf.predict(테스트용_data),columns=['예측결과'])
# concat을 통해 기존 테스트 data와 예측결과 데이터를 합친다.
result = pd.concat([테스트용_data.reset_index(drop=True), 에측결과],axis=1)
result 
```


```python
# k-fold 교차 검증
from sklearn.model_selection import cross_validate

```


```python
# 중요 속성 지표값 출력
import matplotlib
import matplotlib.pyplot as plt
plt.rc('font', family='NanumBarunGothic')

imp = rf.feature_importances_
print('중요속성지표값:',imp)

plt.figure()
plt.bar(range(len(imp)),imp)
plt.xticks(range(len(imp)),data.columns, rotation=90)
plt.show()
```
