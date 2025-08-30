'use client';

import { useFavoriteRegion } from '@/store/useFavoriteRegion';
import { useWeather } from '@/lib/hooks/useWeather';

import { useState, useEffect, useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Customized } from 'recharts';

import { HourlyWeatherEntry } from '@/lib/types/weather';

const chartConfig = {
  temp_max: {
    label: '최고 기온',
    color: 'hsl(var(--chart-1))',
  },
  temp_min: {
    label: '최저 기온',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function Hourly() {
  const { selectedRegion } = useFavoriteRegion();
  const { lat, lon } = selectedRegion ?? {};
  const { data: weatherData, isLoading } = useWeather(lat, lon);
  const [selectedHour, setSelectedHour] = useState<any | null>();

  const now = new Date();
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(
        new Date()
      ),
    []
  );
  const hourlyData: HourlyWeatherEntry[] = useMemo(() => {
    if (!weatherData?.list) return [];
    return weatherData.list.filter((item) => {
      const localDate = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Seoul',
      }).format(new Date(item.dt_txt));
      return localDate === today;
    });
  }, [weatherData, today]);

  const chartData = useMemo(() => {
    const now = Date.now();
    return hourlyData.map((item) => {
      const itemTime = new Date(item.dt_txt);
      const isAfter3Hours = itemTime.getTime() - now >= -3 * 60 * 60 * 1000;

      return {
        time: item.dt_txt.slice(11, 16),
        temp_min: item.main.temp_min + (isAfter3Hours ? 3 : 0),
        temp_max: item.main.temp_max + (isAfter3Hours ? 3 : 0),
        icon: item.weather[0].icon,
        raw: item,
      };
    });
  }, [hourlyData]);

  useEffect(() => {
    if (!selectedHour && hourlyData.length > 0) {
      const defaultHour = hourlyData.find(
        (d) => d.dt_txt.slice(11, 16) === '09:00'
      );
      if (defaultHour) setSelectedHour(defaultHour);
    }
  }, [hourlyData, selectedHour]);

  if (!lat || !lon)
    return (
      <div className="text-center py-8 text-gray-500">
        ⏳ 지역 정보 로딩 중...
      </div>
    );

  return (
    <div className="max-w-md mx-auto w-full">
      <Card className="w-full bg-white rounded-lg border overflow-hidden">
        <ChartContainer config={chartConfig} className="h-[18rem] w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 40, right: 15, left: 0, bottom: 0 }}
            onClick={(e) => {
              if (e && e.activeLabel) {
                const found = chartData.find((d) => d.time === e.activeLabel);
                setSelectedHour(found?.raw ?? null);
              }
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickMargin={10}
              tickLine={false}
              axisLine={false}
              domain={['dataMin', 'dataMax + 2']}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="temp_min"
              type="monotone"
              fill="var(--color-blue-400)"
              stroke="var(--color-blue-800)"
              fillOpacity={0.3}
            />
            <Area
              dataKey="temp_max"
              type="monotone"
              fill="var(--color-red-400)"
              stroke="var(--color-red-700)"
              fillOpacity={0.4}
            />

            {/* 아이콘 표시 */}
            <Customized
              component={(props: any) => {
                const xScale = (
                  Object.values(props.xAxisMap)[0] as {
                    scale: (val: any) => number;
                  }
                )?.scale;
                const yScale = (
                  Object.values(props.yAxisMap)[0] as {
                    scale: (val: any) => number;
                  }
                )?.scale;

                if (
                  typeof xScale !== 'function' ||
                  typeof yScale !== 'function'
                )
                  return null;

                return (
                  <g>
                    {chartData.map(({ time, temp_max }, index: number) => {
                      const icon = hourlyData[index].weather[0].icon;
                      const x = xScale(time);
                      const y = yScale(temp_max) - 35;

                      return (
                        <image
                          key={index}
                          href={`/weather/${icon}.png`}
                          x={x - 15}
                          y={y}
                          width="30"
                          height="30"
                        />
                      );
                    })}
                  </g>
                );
              }}
            />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* 선택된 시간의 상세 정보 */}
      {selectedHour && (
        <div
          className="h-[12rem] mt-6 bg-slate-50 rounded-lg p-4 shadow-md 
        justify-center
        flex items-center gap-4"
        >
          <img
            src={`https://openweathermap.org/img/wn/${selectedHour.weather[0].icon}.png`}
            alt="icon"
            className="w-[6rem] h-[6rem] mr-10 bg-sky-200 rounded-lg"
          />
          <div className="text-sm">
            <div className="font-semibold text-base mb-1">
              {selectedHour.dt_txt.slice(11, 16)} 날씨 정보
            </div>
            {new Date(selectedHour.dt_txt).getTime() - now.getTime() >=
            -3 * 60 * 60 * 1000 ? (
              <>
                <div className="mt-3">
                  🌡️ 최고: {(selectedHour.main.temp_max + 3).toFixed(2)}° /
                  최저: {(selectedHour.main.temp_min + 3).toFixed(2)}°
                </div>
                <div className="mt-3">
                  🥶 체감 온도: {(selectedHour.main.feels_like + 3).toFixed(2)}°
                </div>
              </>
            ) : (
              <>
                <div className="mt-3">
                  🌡️ 최고: {selectedHour.main.temp_max.toFixed(2)}° / 최저:{' '}
                  {selectedHour.main.temp_min.toFixed(2)}°
                </div>
                <div className="mt-3">
                  🥶 체감 온도: {selectedHour.main.feels_like.toFixed(2)}°
                </div>
              </>
            )}
            <div className="mt-3">💧 습도: {selectedHour.main.humidity}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
