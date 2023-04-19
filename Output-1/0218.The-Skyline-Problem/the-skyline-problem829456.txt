// https://leetcode.com/problems/the-skyline-problem/solutions/829456/rust-translated-4ms-100/
impl Solution {
    pub fn get_skyline(buildings: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        use std::collections::BTreeMap;

        let mut res = vec![];
        let mut height = vec![];
        for b in &buildings {
            height.push(vec![b[0], -b[2]]);
            height.push(vec![b[1], b[2]]);
        }
        height.sort();
        let mut map = BTreeMap::<i32, i32>::new();
        map.insert(0, 1);
        let mut prev = 0;
        for h in &height {
            if h[1] < 0 {
                *map.entry(-h[1]).or_default() += 1;
            } else {
                // a end point, remove height
                if *map.get(&h[1]).unwrap() > 1 {
                    *map.entry(h[1]).or_default() -= 1;
                } else {
                    map.remove(&h[1]);
                }
            }
            let cur = *map.keys().last().unwrap();
            if cur != prev {
                res.push(vec![h[0], cur]);
                prev = cur;
            }
        }
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_skyline() {
        assert_eq!(
            Solution::get_skyline(vec![
                vec![2, 9, 10],
                vec![3, 7, 15],
                vec![5, 12, 12],
                vec![15, 20, 10],
                vec![19, 24, 8]
            ]),
            vec![
                vec![2, 10],
                vec![3, 15],
                vec![7, 12],
                vec![12, 0],
                vec![15, 10],
                vec![20, 8],
                vec![24, 0]
            ]
        )
    }
}