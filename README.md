# Get Unicode

웹폰트 사용 시 <code>unicode-range</code> 속성에 활용할 목적으로 제작

**Demo URL** <a href="https://jangjaewan.github.io/getUnicode/index.html" target="_blank">https://jangjaewan.github.io/getUnicode/index.html</a>

## Convert Unicode
**Unicode to Text**
- <code>U+xxxx</code> 형식의 유니코드를 입력하면 해당 문자열 출력
- 구간 검색은 <code>U+xxxa-U+xxxf</code> 형식으로 검색
- <code>U+xxx0, U+xxxa-U+xxxf</code>와 같이 <code>,</code>를 기준으로 혼합하여 검색 가능

**Text to Unicode**
- 문자를 입력하면 해당 문자에 해당하는 유니코드 출력

## Unicode Range
**Korean**
- 완성형 한글 AC00 ~ D7A3 까지의 문자 출력
- 페이지의 각 버튼을 누르면 버튼에 설정된 구간에 해당하는 문자 및 코드 확인
- 각 문자열에 마우스 오버 시 <code>+</code><code>~</code> 버튼이 노출되는데 <code>+</code>는 단일 선택, <code>~</code>는 구간선택 버튼
- 선택이 완료되면 해당 문자 또는 구간에 해당하는 유니코드가 하단에 출력

**All**
- 모든 문자 출력
- 각 버튼의 기능은 Korean과 같음

## 참고 링크
- <a href="https://webisfree.com/2018-07-20/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-unicode-string%EC%9C%BC%EB%A1%9C-%EB%B3%80%ED%99%98%ED%95%98%EA%B1%B0%EB%82%98-%EC%95%8C%EC%95%84%EB%82%B4%EB%8A%94-%EB%B0%A9%EB%B2%95" target="_blank">자바스크립트 Unicode String으로 변환하거나 알아내는 방법</a>
- <a href="https://www.compart.com/en/unicode/U+AC09" target="_blank">Unicode - Compart</a>)