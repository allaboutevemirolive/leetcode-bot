// https://leetcode.com/problems/erect-the-fence/solutions/2831040/rust-convex-hull-algorithm/
use std::collections::HashSet;
impl Solution {
    pub fn outer_trees(trees: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        let mut trees = trees;
        if trees.len() < 3 {
            return trees;
        }
        trees.sort_by(|a, b| {
            if a[0] == b[0] {
                a[1].cmp(&b[1])
            } else {
                a[0].cmp(&b[0])
            }
        });
        let mut st: Vec<(i32, i32)> = Vec::with_capacity(trees.len());

        fn ccw(a: &(i32, i32), b: &(i32, i32), o: &(i32, i32)) -> i32 {
            (a.0 - o.0) * (b.1 - o.1) - (a.1 - o.1) * (b.0 - o.0)
        }

        fn pass<'a>(trees: impl Iterator<Item = &'a Vec<i32>>, st: &mut Vec<(i32, i32)>, begin: usize) {
            for p in trees {
                while st.len() >= begin + 2 && ccw(&st[st.len() - 2], &st[st.len() - 1], &(p[0], p[1])) < 0 {
                    st.pop();
                }
                st.push((p[0], p[1]));
            }
            st.pop();
        }

        pass(trees.iter(), &mut st, 0);
        let b = st.len();
        pass(trees.iter().rev(), &mut st, b);
        st.into_iter().collect::<HashSet<(i32, i32)>>().into_iter().map(|v| vec![v.0, v.1]).collect()
    }
}