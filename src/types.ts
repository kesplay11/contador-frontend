export interface CounterStats{
    total_visits: number,
    last_update: string,// El timestamp de MySQL llega como string (ISO) al JSON
}