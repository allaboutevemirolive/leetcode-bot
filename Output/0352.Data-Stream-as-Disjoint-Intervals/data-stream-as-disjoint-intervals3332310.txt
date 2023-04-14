// https://leetcode.com/problems/data-stream-as-disjoint-intervals/solutions/3332310/rust-2-approaches/
mod btreeset_approach {
    use std::collections::BTreeSet;

    pub struct SummaryRanges {
        nums: BTreeSet<i32>,
    }

    impl SummaryRanges {
        pub fn new() -> Self {
            Self {
                nums: BTreeSet::new(),
            }
        }

        pub fn add_num(&mut self, value: i32) {
            self.nums.insert(value);
        }

        pub fn get_intervals(&self) -> Vec<Vec<i32>> {
            let mut ans = vec![];
            if self.nums.is_empty() {
                return ans;
            }
            let mut left = *self.nums.iter().take(1).next().unwrap();
            let mut right = left;
            for &num in self.nums.iter().skip(1) {
                if num - right == 1 {
                    right = num;
                } else {
                    ans.push(vec![left, right]);
                    left = num;
                    right = num;
                }
            }
            ans.push(vec![left, right]);
            ans
        }
    }
}
mod btreemap_approach {
    use std::collections::BTreeMap;

    pub struct SummaryRanges {
        intervals: BTreeMap<i32, i32>,
    }
    impl SummaryRanges {
        pub fn new() -> Self {
            Self {
                intervals: BTreeMap::new(),
            }
        }

        pub fn add_num(&mut self, value: i32) {
            let mut left = value;
            let mut right = value;

            let floor_entry = self.intervals.range(..=value).last();
            if let Some((l, r)) = floor_entry {
                if *r >= value {
                    return;
                }
                if r + 1 == value {
                    left = *l;
                }
            }

            let ceil_entry = self.intervals.range(value + 1..).take(1).last();

            if let Some((l, r)) = ceil_entry {
                if *l == value + 1 {
                    right = *r;
                    self.intervals.remove(&(value + 1));
                }
            }
            self.intervals.insert(left, right);
        }

        pub fn get_intervals(&self) -> Vec<Vec<i32>> {
            self.intervals
                .iter()
                .map(|(k, v)| vec![*k, *v])
                .collect::<Vec<_>>()
        }
    }
}