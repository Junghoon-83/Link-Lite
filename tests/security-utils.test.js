/**
 * SecurityUtils 단위 테스트
 * XSS 방지 및 입력 검증 기능 테스트
 */

// SecurityUtils 클래스 정의 (테스트용)
class SecurityUtils {
    static escapeHTML(str) {
        if (str === null || str === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }

    static sanitizeInput(str, maxLength = 50) {
        if (str === null || str === undefined) return '';
        return String(str)
            .trim()
            .slice(0, maxLength)
            .replace(/[<>\"'&]/g, '');
    }
}

describe('SecurityUtils', () => {
    describe('escapeHTML', () => {
        it('일반 문자열은 변경 없이 반환', () => {
            expect(SecurityUtils.escapeHTML('Hello World')).toBe('Hello World');
            expect(SecurityUtils.escapeHTML('안녕하세요')).toBe('안녕하세요');
        });

        it('HTML 태그를 이스케이프 처리', () => {
            expect(SecurityUtils.escapeHTML('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
            expect(SecurityUtils.escapeHTML('<img src="x" onerror="alert(1)">')).toBe('&lt;img src="x" onerror="alert(1)"&gt;');
        });

        it('특수문자 이스케이프 처리', () => {
            expect(SecurityUtils.escapeHTML('a & b')).toBe('a &amp; b');
            expect(SecurityUtils.escapeHTML('1 < 2')).toBe('1 &lt; 2');
            expect(SecurityUtils.escapeHTML('2 > 1')).toBe('2 &gt; 1');
        });

        it('null/undefined는 빈 문자열 반환', () => {
            expect(SecurityUtils.escapeHTML(null)).toBe('');
            expect(SecurityUtils.escapeHTML(undefined)).toBe('');
        });

        it('숫자는 문자열로 변환', () => {
            expect(SecurityUtils.escapeHTML(123)).toBe('123');
            expect(SecurityUtils.escapeHTML(0)).toBe('0');
        });
    });

    describe('sanitizeInput', () => {
        it('일반 문자열은 트림 후 반환', () => {
            expect(SecurityUtils.sanitizeInput('  Hello  ')).toBe('Hello');
            expect(SecurityUtils.sanitizeInput('홍길동')).toBe('홍길동');
        });

        it('위험한 문자 제거', () => {
            expect(SecurityUtils.sanitizeInput('<script>')).toBe('script');
            expect(SecurityUtils.sanitizeInput('name"value')).toBe('namevalue');
            expect(SecurityUtils.sanitizeInput("name'value")).toBe('namevalue');
            expect(SecurityUtils.sanitizeInput('a&b')).toBe('ab');
        });

        it('기본 길이 제한 (50자)', () => {
            const longString = 'a'.repeat(100);
            expect(SecurityUtils.sanitizeInput(longString)).toBe('a'.repeat(50));
        });

        it('커스텀 길이 제한', () => {
            const longString = 'a'.repeat(100);
            expect(SecurityUtils.sanitizeInput(longString, 10)).toBe('a'.repeat(10));
            expect(SecurityUtils.sanitizeInput(longString, 30)).toBe('a'.repeat(30));
        });

        it('null/undefined는 빈 문자열 반환', () => {
            expect(SecurityUtils.sanitizeInput(null)).toBe('');
            expect(SecurityUtils.sanitizeInput(undefined)).toBe('');
        });

        it('복합 케이스 처리', () => {
            expect(SecurityUtils.sanitizeInput('  <script>홍길동</script>  ')).toBe('script홍길동/script');
        });
    });
});
