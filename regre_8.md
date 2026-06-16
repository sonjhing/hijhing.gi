# 🌳 과일·채소 분류 모델 (Decision Tree + 교차검증)

---

# 1. 데이터 불러오기

```python
import pandas as pd

# 컴퓨터에서 실행 시 주석 해제
src_data = pd.read_csv(
    './머신러닝실습용자료/과일채소목록.csv',
    encoding='cp949'
)

src_data