export interface MetricStat {
    name: string
    version: number
    metric_id: string
    target_responses?: number | null
    level: number
    subjects: number[]
    max_points: number
    total_items: number
    target_group: number
    average_score: number | null
    total_responses: number
}

export type EvaluationItemStatus = {
    uuid: string
    class_metrics: MetricStat[] | null
    prep_metrics: MetricStat[] | null
    other_metrics: MetricStat[] | null
    surveys: {
        version: number
        survey_id: string
        target_responses?: number | null
        subjects: number[]
        total_questions: number
        target_group: number
        total_responses: number
    }[] | null
    start_date: string
    end_date: string
    status: 0 | 1 | 2
    year: number
    term: 1 | 2
    school_name: string
    survey_score: number | null
}

export interface EvaluationItemDetails {
    uuid: string
    school_id: number
    school_name: string
    class_metrics: RubricInstance[] | null
    prep_metrics: RubricInstance[] | null
    other_metrics: RubricInstance[] | null
    surveys: SurveyInstance[] | null
    start_date: string
    end_date: string
    status: number //0|1|2
    year: number
    term: 1 | 2
    survey_score?: number | null
    level: 1
    stats: {
        survey_target: number
        survey_response: number
        prep_metric_target: number
        class_metric_target: number
        prep_metric_response: number
        class_metric_response: number
        other_metric_target: number
        other_metric_response: number
        form_target: number
        form_response: number
    }
}

export interface EvaluationFullData {
    evaluations: EvaluationItemStatus[]
    stats: {
        in_progress: number
        completed: number
        total_schools: number
    }
    history: Record<string, { year: number, month: number, score: number }[]> // keys are number strings
    rankings: Record<string, Record<string, { school_name: string, avg_score: null | number }[]>> // keys are number strings
}

export interface RankingItem {
    id: number
    school_name: string
    level: number | 0 | 1 | 2 | 3 | 4// 0 = elementary, 1 = middle, 2 = high
    address: string | null
    contact: string | null
    scores: Record<string, number> // Maps year to score. JSON keys must be string.
    not_started: number
    in_progress: number
    completed: number
    count: number
}

export interface ProcessedRankingData {
    id: number,
    level: string,
    schoolName: string;
    scores: {[year: string]: number}
}

export type EvaluationDashboardData = {
    evaluations: EvaluationItemStatus[],
    rankings: RankingItem[]
}

/** 一级指标 */
export type Criteria = {
    criteria: {
        name: string
        maxPoints: number
        description: string
    }[]
    name: string
    maxPoints: number
    description?: string
}

/** From Rubrics Table */
export type Rubric = {
    uuid: string
    version: number
    name: string
    basic_info: string[]
    criteria: Criteria[]
    creation_date: string
    last_modified: string
    type: FormType
    target_group: -1 | 0 | 1 | 2 // -1 = all, 0 = students, 1 = teachers, 2 = evaluators
    max_points: number
    total_items: number
    info: {
        level: number[]
        subjects: number[]
    }
    form_description: string
    comments: string[]
    deleted: 0 | 1
    expired? : 0 | 1
}

/** A rubric table as part of an evaluation */
export interface RubricInstance {
    version: number
    metric_id: string
    name: string
    level: number
    max_points: number
    total_items: number
    target_responses: number | null
    total_responses: number
}

export type Response = {
    response_id: number;
    evaluator: string;
    data: number[][];
    total_percent: number;
    comments: string[];
    submitted_date: string;
}

/** A metric is a score sheet with statistics. */
export interface Metric extends RubricInstance {
    average_score: number | null
    responses_count?: number
}

export type School = {
    id: number
    school_name: string
    level: 0 | 1 | 2 | 3 | 4
    address: string | null
    contact: string | null
    scores: Record<string, number>
    not_started: number
    in_progress: number
    completed: number
    count: number
}

/** Survey template */
export interface Survey {
    survey_version: number
    levels: number[]
    survey_id: string
    title: string
    target_group: -1 | 0 | 1 | 2
    total_questions: number
    num_evaluations?: number
    creation_date: string
    last_modified: string
}

export interface SurveyTemplateStats {
    stat: string;
    value: number;
}

export interface SurveyInstance extends Survey {
    total_responses?: number
    target_responses: number | null
}

//Constants
export const EDUCATION_LEVELS = ["Primary School", "Middle School", "High School", "University", "Vocational School"]
export const SUBJECTS = ["Biology", "Math", "English", "Physics", "Art"]
export const TARGET_GROUP: Record<number, string> = {
    "-1": "General",
    "0": "Student",
    "1": "Teacher",
    "2": "Parents" 
}
export const CLASS_SCORE_BINS = ["好课", "较好课", "一般课", "差课"]
export const SCORE_BIN_VALUES = [0.85, 0.75, 0.60]
export const OTHER_SCORE_BINS = ["优秀", "良好", "一般", "差"]
export const GRADE_OPTIONS = [
    { value: '13', label: '其他' },
    { value: '1', label: '小学1年级' },
    { value: '2', label: '小学2年级' },
    { value: '3', label: '小学3年级' },
    { value: '4', label: '小学4年级' },
    { value: '5', label: '小学5年级' },
    { value: '6', label: '小学6年级' },
    { value: '7', label: '初一' },
    { value: '8', label: '初二' },
    { value: '9', label: '初三' },
    { value: '10', label: '高一' },
    { value: '11', label: '高二' },
    { value: '12', label: '高三' },
  ];

export interface MetricReportInstance {
    rubrics: Criteria[][]
    scores: (number[][] | null)[]
    response_scores: (number[] | null)[]
    response_details: (number[][][] | null)[]
    subjects: (number[] | null)[]
    stats: {
        overall: number | null
        // total score, max score, percentage
        form_stats: [number | null, number | null, number | null][]
        //rubric_stats: (number[][] | null)[]
        rubric_stats: (number[] | null)[]
    }
    comments: (null | string)[] // 待确认
    comment_questions: string[][] // 待确认
    metric_names: string[]
}

export interface MetricReport {
    class: MetricReportInstance
    prep: MetricReportInstance
    other: MetricReportInstance
    survey: {
        score: number | null
    }
    school_name: string
}


export interface EvalRowType {
    id: string;
    school_name: string;
    status: 0 | 1 | 2;
    start_date: string;
    end_date: string;
    class_status: number;
    class_total? : number;
    prep_status: number;
    prep_total? : number;
    survey_status?: number | null;
    survey_total?: number;
}

export type FormType = "class" | "prep" | "other" 