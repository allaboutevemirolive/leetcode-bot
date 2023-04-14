// https://leetcode.com/problems/data-stream-as-disjoint-intervals/solutions/3109161/rust-solution/
use std::collections::BTreeSet;

#[derive(Default)]
struct SummaryRanges {
    data: BTreeSet<(i32, i32)>,
}

fn merge(a: &[(i32, i32)]) -> Vec<(i32, i32)> {
    let mut res = vec![a[0]];
    for &(x, y) in &a[1..] {
        let (lx, ly) = res.pop().unwrap();
        if ly + 1 < x {
            res.extend([(lx, ly), (x, y)]);
        } else {
            res.push((lx, ly.max(y)));
        }
    }
    res
}

impl SummaryRanges {
    fn new() -> Self {
        Default::default()
    }

    fn add_num(&mut self, value: i32) {
        let v: Vec<_> = self
            .data
            .range(..(value, i32::MAX))
            .next_back()
            .copied()
            .into_iter()
            .chain(std::iter::once((value, value)))
            .chain(self.data.range((value, 0)..).next().copied())
            .collect();
        for x in &v {
            self.data.remove(x);
        }
        self.data.extend(merge(&v));
    }

    fn get_intervals(&self) -> Vec<Vec<i32>> {
        self.data.iter().map(|&(x, y)| vec![x, y]).collect()
    }
}
