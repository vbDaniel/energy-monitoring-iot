import json
import random
import time
from datetime import datetime, timedelta

def analyze_existing_data():
    """Analisa os dados existentes para extrair padrões"""
    with open('logs_trifasico_inicial.json', 'r') as file:
        data = json.load(file)
    
    # Separar por tipo de medição
    patterns = {
        'cur_voltage_1': [],
        'cur_voltage_2': [],
        'cur_power_1': [],
        'cur_power_2': [],
        'cur_current_1': [],
        'cur_current_2': [],
        'balance_kwh': []
    }
    
    for record in data:
        code = record['code']
        if code in patterns:
            patterns[code].append(int(record['value']))
    
    # Calcular estatísticas para cada tipo
    stats = {}
    for code, values in patterns.items():
        if values:
            stats[code] = {
                'min': min(values),
                'max': max(values),
                'avg': sum(values) / len(values),
                'count': len(values)
            }
    
    return stats

def generate_realistic_value(code, stats, hour_of_day=12, day_of_week=2):
    """Gera valores realistas baseados nos padrões identificados"""
    if code not in stats:
        return "0"
    
    base_min = stats[code]['min']
    base_max = stats[code]['max']
    base_avg = stats[code]['avg']
    
    # Fatores de variação baseados no horário e dia da semana
    # Simulando consumo maior durante o dia e menor à noite
    if code.startswith('cur_power'):
        # Consumo de energia varia ao longo do dia
        time_factor = 0.7 + 0.6 * (1 + 0.5 * abs(12 - hour_of_day) / 12)
        if 6 <= hour_of_day <= 22:  # Horário comercial
            time_factor *= 1.3
        if day_of_week < 5:  # Dias úteis
            time_factor *= 1.2
    elif code.startswith('cur_voltage'):
        # Tensão é mais estável, pequenas variações
        time_factor = 0.95 + random.uniform(-0.05, 0.05)
    elif code.startswith('cur_current'):
        # Corrente varia com o consumo
        time_factor = 0.7 + 0.6 * (1 + 0.5 * abs(12 - hour_of_day) / 12)
        if 6 <= hour_of_day <= 22:
            time_factor *= 1.3
        if day_of_week < 5:
            time_factor *= 1.2
    elif code == 'balance_kwh':
        # Saldo de energia acumula ao longo do tempo
        time_factor = 1.0
    else:
        time_factor = 1.0
    
    # Gerar valor com variação realística
    target_avg = base_avg * time_factor
    variance = (base_max - base_min) * 0.3
    
    value = int(random.normalvariate(target_avg, variance / 3))
    
    # Garantir limites realísticos
    value = max(int(base_min * 0.5), min(int(base_max * 1.5), value))
    
    return str(value)

def generate_mock_data(num_records=300000):
    """Gera dados mock baseados nos padrões dos dados reais"""
    print("Analisando dados existentes...")
    stats = analyze_existing_data()
    
    print("Estatísticas dos dados reais:")
    for code, stat in stats.items():
        print(f"  {code}: min={stat['min']}, max={stat['max']}, avg={stat['avg']:.1f}, count={stat['count']}")
    
    print(f"\nGerando {num_records} registros mock...")
    
    # Começar de uma data mais antiga para ter mais período histórico
    # Começar 3 meses atrás para ter dados suficientes para previsão
    start_date = datetime(2024, 11, 1, 0, 0, 0)  # 1º de novembro de 2024
    start_timestamp = int(start_date.timestamp() * 1000)
    
    # Códigos disponíveis
    codes = ['cur_voltage_1', 'cur_voltage_2', 'cur_power_1', 'cur_power_2',
             'cur_current_1', 'cur_current_2', 'balance_kwh']
    
    mock_data = []
    current_timestamp = start_timestamp
    
    # Gerar dados por intervalos menores (simulando medições a cada 15 minutos)
    # Isso dará melhor granularidade para análise horária
    interval_ms = 15 * 60 * 1000  # 15 minutos em milissegundos
    
    records_per_interval = len(codes)
    num_intervals = num_records // records_per_interval
    
    balance_kwh_value = 5000  # Valor inicial mais baixo para crescer ao longo do tempo
    
    for interval in range(num_intervals):
        # Calcular data/hora atual para fatores de variação
        current_time = datetime.fromtimestamp(current_timestamp / 1000)
        hour_of_day = current_time.hour
        day_of_week = current_time.weekday()
        
        # Adicionar variação pequena no timestamp (±10 segundos)
        timestamp_variation = random.randint(-10000, 10000)
        
        for i, code in enumerate(codes):
            # Cada medição tem um pequeno offset de tempo
            record_timestamp = current_timestamp + (i * 1000) + timestamp_variation
            
            if code == 'balance_kwh':
                # Balance KWh deve incrementar ocasionalmente
                if random.random() < 0.1:  # 10% de chance de incrementar
                    balance_kwh_value += random.randint(0, 2)
                value = str(balance_kwh_value)
            else:
                value = generate_realistic_value(code, stats, hour_of_day, day_of_week)
            
            mock_data.append({
                "code": code,
                "event_time": record_timestamp,
                "value": value
            })
        
        current_timestamp += interval_ms
        
        # Mostrar progresso
        if interval % 1000 == 0:
            progress = (interval / num_intervals) * 100
            print(f"Progresso: {progress:.1f}%")
    
    # Embaralhar os dados para simular ordem não cronológica (como nos dados reais)
    random.shuffle(mock_data)
    
    return mock_data[:num_records]

def main():
    print("=== Gerador de Dados Mock para Monitoramento de Energia ===")
    
    # Gerar dados mock com 300.000 registros
    mock_data = generate_mock_data(300000)
    
    print(f"\nSalvando {len(mock_data)} registros em 'logs_trifasico_mock.json'...")
    
    with open('logs_trifasico_mock.json', 'w') as file:
        json.dump(mock_data, file, indent=2)
    
    print("✅ Arquivo de dados mock gerado com sucesso!")
    
    # Mostrar algumas estatísticas
    codes_count = {}
    for record in mock_data:
        code = record['code']
        codes_count[code] = codes_count.get(code, 0) + 1
    
    print("\nEstatísticas dos dados gerados:")
    for code, count in codes_count.items():
        print(f"  {code}: {count} registros")
    
    # Mostrar período temporal
    timestamps = [record['event_time'] for record in mock_data]
    start_time = datetime.fromtimestamp(min(timestamps) / 1000)
    end_time = datetime.fromtimestamp(max(timestamps) / 1000)
    
    print(f"\nPeríodo temporal:")
    print(f"  Início: {start_time}")
    print(f"  Fim: {end_time}")
    print(f"  Duração: {end_time - start_time}")

if __name__ == "__main__":
    main()