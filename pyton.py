import json
import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt

# 1. Carregar dados do arquivo JSON (usando dados mock extensos)
with open('logs_trifasico_mock.json', 'r') as file:
    massa_de_dados = json.load(file)

df = pd.DataFrame(massa_de_dados)
df['event_time'] = pd.to_datetime(df['event_time'], unit='ms')
# Converter valores para numérico
df['value'] = pd.to_numeric(df['value'], errors='coerce')

print(f"Total de registros carregados: {len(df)}")
print(f"Códigos únicos disponíveis: {df['code'].unique()}")
print(f"Período temporal: {df['event_time'].min()} até {df['event_time'].max()}")

# Filtrar apenas dados de potência
power_data = df[df['code'].isin(['cur_power_1', 'cur_power_2'])].copy()
print(f"Registros de potência: {len(power_data)}")

# Criar tabela pivot para ter ambas as potências por timestamp
power_pivot = power_data.pivot_table(
    index='event_time',
    columns='code',
    values='value',
    aggfunc='mean'  # média se houver múltiplos valores no mesmo timestamp
).reset_index()

# Calcular potência total (W)
power_pivot['total_power'] = (
    power_pivot.get('cur_power_1', 0).fillna(0) +
    power_pivot.get('cur_power_2', 0).fillna(0)
)

print(f"Dados com potência total: {len(power_pivot)}")

# Reamostragem horária para calcular consumo em Wh
# Definir timestamp como índice para reamostragem
power_pivot.set_index('event_time', inplace=True)

# Reamostragem horária - calcular consumo médio por hora
hourly_data = power_pivot['total_power'].resample('H').agg({
    'mean': 'mean',      # Potência média da hora
    'count': 'count'     # Número de medições na hora
}).reset_index()

# Calcular consumo em Wh (assumindo que a potência é constante durante a hora)
# Wh = W * h, então potência média * 1 hora = Wh
hourly_data['consumption_wh'] = hourly_data['mean'] * 1  # 1 hora

# Filtrar apenas horas com dados suficientes (pelo menos 1 medição)
hourly_data = hourly_data[hourly_data['count'] >= 1].copy()

# Preparar dados para o Prophet
prophet_df = hourly_data[['event_time', 'consumption_wh']].rename(
    columns={'event_time': 'ds', 'consumption_wh': 'y'}
)

# Remover valores NaN e outliers extremos
prophet_df = prophet_df.dropna()
prophet_df = prophet_df[prophet_df['y'] > 0]  # Remover consumos negativos/zero

print(f"Dados após reamostragem horária: {len(prophet_df)}")
print(f"Período dos dados: {prophet_df['ds'].min()} até {prophet_df['ds'].max()}")
print(f"Consumo médio: {prophet_df['y'].mean():.2f} Wh")
print(f"Consumo máximo: {prophet_df['y'].max():.2f} Wh")
print(f"Consumo mínimo: {prophet_df['y'].min():.2f} Wh")

if len(prophet_df) < 10:
    print("Erro: Dados insuficientes para treinar o modelo Prophet")
    print("Primeiros registros:")
    print(prophet_df.head(10))
    exit()

# 4. Treinar modelo
model = Prophet(daily_seasonality=True, weekly_seasonality=True)
model.fit(prophet_df)

# 5. Previsão (3 meses à frente)
future = model.make_future_dataframe(periods=90, freq='D')
forecast = model.predict(future)

# 6. Ver resultado
fig = model.plot(forecast)
plt.title('Previsão de Consumo de Energia (Dados Horários)')
plt.xlabel('Data')
plt.ylabel('Consumo por Hora (Wh)')
plt.show()

# Exibir algumas estatísticas
print(f"\n=== ESTATÍSTICAS FINAIS ===")
print(f"Dados processados: {len(prophet_df)} registros horários")
print(f"Período dos dados: {prophet_df['ds'].min()} até {prophet_df['ds'].max()}")
print(f"Consumo médio: {prophet_df['y'].mean():.2f} Wh/hora")
print(f"Consumo máximo: {prophet_df['y'].max():.2f} Wh/hora")
print(f"Consumo mínimo: {prophet_df['y'].min():.2f} Wh/hora")

# Estatísticas de consumo diário estimado
daily_consumption_kwh = (prophet_df['y'].mean() * 24) / 1000  # Converter Wh para kWh
print(f"Consumo diário estimado: {daily_consumption_kwh:.2f} kWh/dia")
print(f"Consumo mensal estimado: {daily_consumption_kwh * 30:.2f} kWh/mês")

# Mostrar algumas previsões
print(f"\n=== PREVISÕES ===")
future_data = forecast.tail(10)[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
future_data['ds'] = pd.to_datetime(future_data['ds'])
print("Últimas 10 previsões:")
for _, row in future_data.iterrows():
    print(f"  {row['ds'].strftime('%Y-%m-%d %H:%M')}: {row['yhat']:.1f} Wh/h (±{(row['yhat_upper']-row['yhat_lower'])/2:.1f})")