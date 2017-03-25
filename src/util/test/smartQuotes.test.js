import smartQuotes from '../smartQuotes';

describe('smartQuotes()', () => {
  const sq = smartQuotes;
  it('converts start and end double quotes', () => {
    expect(sq('"test"')).toBe('“test”');
    expect(sq('the—"test"')).toBe('the—“test”');
  });
  it('converts single quotes', () => {
    expect(sq('\'test\'')).toBe('‘test’');
    expect(sq('ma\'am')).toBe('ma’am');
    expect(sq('\'em')).toBe('’em');
    expect(sq('Marshiness of \'Ammercloth\'s')).toBe('Marshiness of ’Ammercloth’s');
  });
  it('converts abbreviated date single quote', () => {
    expect(sq('\'95')).toBe('’95');
  });
  it('converts triple prime', () => {
    expect(sq('\'\'\'')).toBe('‴');
  });
  it('converts double prime', () => {
    expect(sq('\'\'')).toBe('″');
  });
  it('converts globally', () => {
    expect(sq('Ma\'am, this "test" is from \'95 with double prime: \'\' and trip\'s too: \'\'\''))
      .toBe('Ma’am, this “test” is from ’95 with double prime: ″ and trip’s too: ‴');
  });
});
