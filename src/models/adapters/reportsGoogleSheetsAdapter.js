export default class reportsGoogleSheetsAdapter {
  static toProgram(objs) {
    return objs.map((obj, i) => ({
      id: i,
      filial: obj['Выберите пансионат'],
      date: obj['Дата'],
      timestamp: obj.Timestamp,
      residents: obj['Количество человек'],
      balance: obj['Остаток (касса)'],
    }))
  }

  static toService(objs) {
    return objs.map((obj) => ({
      Timestamp: obj.timestamp,
      'Выберите пансионат': obj.filial,
      'Дата': obj.data,
      'Количество человек': obj.residents,
      'Остаток (касса)': obj.balance,
    })).filter(undefined);
  }
}