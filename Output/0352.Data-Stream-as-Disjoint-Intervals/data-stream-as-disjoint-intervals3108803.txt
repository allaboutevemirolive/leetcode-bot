// https://leetcode.com/problems/data-stream-as-disjoint-intervals/solutions/3108803/rust-simple-merging-of-intervals-using-btreemap/
use std::collections::BTreeMap;

#[derive(Default)]
struct SummaryRanges {
    tree: BTreeMap<i32, i32>,
}

impl SummaryRanges {
    fn new() -> Self {
        Default::default()
    }

    fn add_num(&mut self, value: i32) {
        // Check if there is an interval that ends right before `value`
        // In other words - is there an interval that we should extend ?
        let mut before = None;

        // Check if there is an interval that starts right after `value`
        // In other words - is there an interval that we should extend ?
        let mut after = None;

        if let Some((&start, &end)) = self.tree.range(..=value).last() {
            if end >= value {
                // The new value is already inside the interval [start; end]
                // thus,we don't need to do anything
                return;
            }

            if end + 1 == value {
                // we should extend this interval from [start; end] to [start; value]
                before = Some((start, end));
            }
        }

        if let Some((&start, &end)) = self.tree.range(value..).next() {
            if start == value {
                // The new value is already inside the interval [start; end]
                // thus,we don't need to do anything
                return;
            }

            if value + 1 == start {
                // we should extend this interval from [start; end] to [value; end]
                after = Some((start, end));
            }
        }

        match (before.take(), after.take()) {
            (Some((s, e)), None) => {
                // Extending the interval before `value`
                self.tree.insert(s, value);
            }

            (None, Some((s, e))) => {
                // Extending the interval after `value`
                self.tree.remove(&s);
                self.tree.insert(value, e);
            }

            (Some((s1, e1)), Some((s2, e2))) => {
                // because the new value makes the two intervals "touch"
                // we should merge them into ine interval
                self.tree.remove(&s2);
                self.tree.insert(s1, e2);
            }

            _ => {
                // The new value does not overlap with any interval, thus we have to insert a new one
                self.tree.insert(value, value);
            }
        }
    }

    fn get_intervals(&self) -> Vec<Vec<i32>> {
        self.tree.iter().map(|(&s, &e)| vec![s, e]).collect()
    }
}