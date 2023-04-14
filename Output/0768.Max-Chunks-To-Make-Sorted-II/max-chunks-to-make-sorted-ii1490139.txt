// https://leetcode.com/problems/max-chunks-to-make-sorted-ii/solutions/1490139/rust-solution/
impl Solution {
    pub fn max_chunks_to_sorted(arr: Vec<i32>) -> i32 {
        let mut st = Vec::new();
        let mut cur = -1;
        for x in arr {
            while st.last().map_or(false, |&z| z > x) {
                st.pop();
            }
            cur = cur.max(x);
            st.push(cur);
        }
        st.len() as _
    }
}