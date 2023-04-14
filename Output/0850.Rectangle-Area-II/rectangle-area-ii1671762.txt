// https://leetcode.com/problems/rectangle-area-ii/solutions/1671762/two-ways-in-rust/
// sort x, then aggregate y intervals, then sum up area into res. Can also be done sort y, then x intervals.
impl Solution {
    const MOD: i64 = 1_000_000_007;
    pub fn rectangle_area(rectangles: Vec<Vec<i32>>) -> i32 {
        use std::collections::BTreeMap;
        let mut b_map: BTreeMap<i32, Vec<(i32,i32,i32)>> = BTreeMap::new();
        for item in rectangles {
            b_map.entry(item[0]).or_default().push((item[1], item[3], 1));
            b_map.entry(item[2]).or_default().push((item[1], item[3], -1));
        }
        let mut count_map: BTreeMap<i32, i32> = BTreeMap::new();
        let mut res = 0;
        let mut pre_x = -1;
        for (x, y_ranges) in b_map {
            if pre_x >= 0 && x - pre_x > 0 {
                let mut sum_y = 0;
                let mut sum = 0;
                let mut start = i32::MIN;
                for (&y, &count) in &count_map {
                    if count == 0 {continue}
                    if start == i32::MIN {
                        start = y;   
                    }
                    sum += count;
                    if sum == 0 {
                        sum_y += y - start;
                        start = i32::MIN;
                    }
                }
                res += ((x - pre_x) as i64 * sum_y as i64) % Self::MOD;
                res %= Self::MOD;
            }
            for y_range in y_ranges {
                *count_map.entry(y_range.0).or_default() += y_range.2;
                *count_map.entry(y_range.1).or_default() += -y_range.2;
            }
            pre_x = x;
        }
        res as i32
    }
}