// https://leetcode.com/problems/data-stream-as-disjoint-intervals/solutions/3108813/rust-btreeset-of-values-fold/
use std::collections::BTreeSet;

struct SummaryRanges {
    set: BTreeSet<i32>,
}

impl SummaryRanges {
    fn new() -> Self {
        Self {
            set: BTreeSet::new(),
        }
    }

    fn add_num(&mut self, value: i32) {
        self.set.insert(value);
    }

    fn get_intervals(&self) -> Vec<Vec<i32>> {
        self.set.iter().fold(vec![], |mut result, &current| {
            if let Some(last_tuple) = result.last_mut() {
                // last_tuple[1] = previous value
                if last_tuple[1] == current - 1 {
                    last_tuple[1] = current;
                    return result;
                }
            }
            result.push(vec![current, current]);
            result
        })
    }
}