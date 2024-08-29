"use client";
import React from "react";
import { useSettingsContext } from "src/components/settings";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import RadarChartUnit from "./radar-chart-unit-metric";
import { SUBJECTS, MetricReportInstance } from "src/types/evaluation";

export interface subjectData {
  subjectName: string;
  firstTarget: {
    firstTargetName: string
    secondTarget: {
      secondTargetName: string
      value: number[]
    }[];
  }[];
}

export type DataItem = {
  firstTargetName: string;
  secondTarget: string[];
};

export interface UnitMetricProps {
  metaRadarData: MetricReportInstance;
}

export const processMetaRadarData = (metaRadarData: MetricReportInstance): { avgSubjects: subjectData[], mergedData: DataItem[] } => {
  // 获取第二指标
  const secondTargetDict = metaRadarData.rubrics.flatMap(t => t.map(a => ({
    firstTargetName: a.name,
    secondTarget: a.criteria.map(b => b.name),
  })));

  const mergedData: DataItem[] = [];
  const tempData: { [key: string]: DataItem } = {};

  secondTargetDict.forEach(({ firstTargetName, secondTarget }) => {
    if (tempData[firstTargetName]) {
      tempData[firstTargetName].secondTarget = mergeAndRemoveDuplicates(tempData[firstTargetName].secondTarget, secondTarget);
    } else {
      tempData[firstTargetName] = { firstTargetName, secondTarget };
      mergedData.push(tempData[firstTargetName]);
    }
  });

  // 获取第一指标 
  const firstTargetDict = metaRadarData.rubrics.flatMap(a => a.map(b => b.name)).filter((value, index, self) => self.indexOf(value) === index);
  
  // 定义标准格式
  const standRadarData: subjectData[] = SUBJECTS.map(s => ({
    subjectName: s,
    firstTarget: firstTargetDict.map(a => {
      const secondTargetDict = mergedData.find(x => x.firstTargetName === a)?.secondTarget || [];
      return {
        firstTargetName: a,
        secondTarget: secondTargetDict.map(y => ({
          secondTargetName: y,
          value: [],
        })),
      };
    }),
  }));

  // 填入二级指标数据
  metaRadarData.rubrics.forEach((t, tIndex) => {
    metaRadarData.subjects[tIndex]?.forEach((subject, subjectIndex) => {
      t.forEach((target, targetIndex) => {
        target.criteria.forEach((secondTarget, secondTargetIndex) => {
          standRadarData.forEach(s => {
            if (s.subjectName === SUBJECTS[subject]) {
              s.firstTarget.forEach(a => {
                if (a.firstTargetName === target.name) {
                  a.secondTarget.forEach(b => {
                    if (b.secondTargetName === secondTarget.name) {
                      const responseValue = metaRadarData.response_details[tIndex]?.[subjectIndex]?.[targetIndex]?.[secondTargetIndex] ?? null;
                      if (responseValue !== null) {
                        b.value.push(responseValue);
                      }
                    }
                  });
                }
              });
            }
          });
        });
      });
    });
  });
  
  
  // 将科目二级指标的数据数组取平均
  standRadarData.forEach(s => {
    //将无数据的二级指标去除
    s.firstTarget.forEach(a => {  
      a.secondTarget = a.secondTarget.filter(b => b.value.length > 0).map(b => ({
        ...b,
        value: [b.value.reduce((sum, current) => sum + current, 0) / b.value.length],
      }));
    });
     // 将无二级指标的一级指标去除    
    s.firstTarget = s.firstTarget.filter(a => a.secondTarget.length > 0);
  });
  // 将无一级指标的学科去除
  const avgSubjects = standRadarData.filter(s => s.firstTarget.length > 0);

  return { avgSubjects, mergedData };
};

function mergeAndRemoveDuplicates(arr1: string[], arr2: string[]): string[] {
  return Array.from(new Set([...arr1, ...arr2]));
}

export default function UnitMetricView({ metaRadarData }: UnitMetricProps) {
  const settings = useSettingsContext();

  const { avgSubjects, mergedData } = processMetaRadarData(metaRadarData);
  
  return (
    <RadarChartUnit radarData={avgSubjects} categories={mergedData}/>
  );
}

