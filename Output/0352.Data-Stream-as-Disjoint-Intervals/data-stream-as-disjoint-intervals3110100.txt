// https://leetcode.com/problems/data-stream-as-disjoint-intervals/solutions/3110100/rust-solution-using-ordered-map-btreemap/
use std::collections::BTreeMap;

struct SummaryRanges {
    intervals: BTreeMap<i32, i32>,
}
impl SummaryRanges {
    fn new() -> Self {
        SummaryRanges {
            intervals: BTreeMap::new(),
        }
    }

    fn add_num(&mut self, value: i32) {
        match (
            self.intervals.range(..(value)).last(),
            self.intervals.range((value)..).next(),
        ) {
            (None, None) => {
                self.intervals.insert(value, value);
            }
            (None, Some((&s, &e))) => {
                if s - 1 == value {
                    self.intervals.insert(value, e);
                    self.intervals.remove(&s);
                } else if value < s {
                    self.intervals.insert(value, value);
                }
            }
            (Some((&s, &e)), None) => {
                if e + 1 == value {
                    self.intervals.insert(s, value);
                } else if e < value {
                    self.intervals.insert(value, value);
                }
            }
            (Some((&s1, &e1)), Some((&s2, &e2))) => {
                if e1 + 1 == value && s2 - 1 == value {
                    self.intervals.insert(s1, e2);
                    self.intervals.remove(&s2);
                } else if e1 + 1 == value {
                    self.intervals.insert(s1, value);
                } else if s2 - 1 == value {
                    self.intervals.insert(value, e2);
                    self.intervals.remove(&s2);
                } else if e1 < value && s2 > value {
                    self.intervals.insert(value, value);
                }
            }
        };
    }

    fn get_intervals(&self) -> Vec<Vec<i32>> {
        self.intervals.iter().map(|(&a, &b)| vec![a, b]).collect()
    }
}