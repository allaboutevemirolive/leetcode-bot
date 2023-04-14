// https://leetcode.com/problems/data-stream-as-disjoint-intervals/solutions/3107785/rust-use-btreeset-solution/
struct SummaryRanges {
    ranges: std::collections::BTreeSet<(i32, i32)>,
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl SummaryRanges {

    fn new() -> Self {
        SummaryRanges { ranges: std::collections::BTreeSet::new() }
    }
    
    fn add_num(&mut self, value: i32) {
        let mut new_range = (value, value);
        let &left = self.ranges.range(..(value, value)).last().unwrap_or(&new_range);
        let &right = self.ranges.range((value, value)..).next().unwrap_or(&new_range);

        if left.1 >= value - 1 {
            new_range = (left.0, std::cmp::max(left.1, value));
            self.ranges.remove(&left);
        }
        if right.0 <= value + 1 && new_range.1 < right.1 {
            new_range = (std::cmp::min(new_range.0, right.0), right.1);
            self.ranges.remove(&right);
        }

        self.ranges.insert(new_range);
    }
    
    fn get_intervals(&self) -> Vec<Vec<i32>> {
        self.ranges.iter().map(|(l, r)| vec![*l, *r]).collect()
    }
}

/**
 * Your SummaryRanges object will be instantiated and called as such:
 * let obj = SummaryRanges::new();
 * obj.add_num(value);
 * let ret_2: Vec<Vec<i32>> = obj.get_intervals();
 */