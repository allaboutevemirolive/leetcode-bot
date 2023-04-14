// https://leetcode.com/problems/orderly-queue/solutions/2783036/rust-two-cases-with-minimal-copying-3ms-2mb/
impl Solution {
    pub fn orderly_queue(s: String, k: i32) -> String {
        if k >= 2 {
            // This is bubble sort by another name; skip to answer and sort it in ascending order.
            let mut buf: Vec<u8> = s.into_bytes();
            buf.sort_unstable();
            return String::from_utf8(buf).unwrap();
        }  // else, k == 1 by input constraints
        // Otherwise, cycle through the whole thing and take the lowest choice.
        let s = s.as_bytes();
        let n = s.len();
        let mut buf = vec![0; n+n];
        buf[.. n].copy_from_slice(&s[..]);
        buf[n ..].copy_from_slice(&s[..]);
        buf.windows(n)
            .skip(1)  // avoids waste from double-checking the original string
			.min()  // finds lexically smallest slice of u8
            .map(|ss| String::from_utf8(ss.to_vec()).unwrap())
            .unwrap()
    }
}