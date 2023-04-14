// https://leetcode.com/problems/transform-to-chessboard/solutions/1487839/rust-bit-based-solution-for-fun/
impl Solution {
    fn get_number(arr: &Vec<i32>) -> Option<i32> {
        let mask = (1 << arr.len()) -1;
        let test:i32 = 0x2AAAAAAA & mask;
        
        arr.iter().fold(Some((-1, -1, 0i32, 0i32)), |s, &n| {
            match s {
                Some((-1, -1, c, d)) => Some((n, -1, c + 1, d)),
                Some((f, b, c, d)) if f == n => Some((f, b, c + 1, d)),
                Some((f, -1, c, d)) => Some((f, n, c, d + 1)),
                Some((f, b, c, d)) if b == n => Some((f, b, c, d + 1)),
                Some(_) => None,
                None => None
            }
        }).filter(|(a, b, _, _)| 
            a & b == 0 && (a|b) == mask && 
            (a.count_ones() as i32 - b.count_ones() as i32).abs() <= 1
        ).filter(|(_, _, c1, c2)|
            (c1 - c2).abs() <= 1
        ).map(|(a, b, _,_)| {
            vec![a^test, a^test^mask].into_iter()
                .map(|v|v.count_ones() as i32)
                .map(|v| (v>>1) | (v&1)<<6)
                .min().unwrap()
        })
    }
    pub fn moves_to_chessboard(board: Vec<Vec<i32>>) -> i32 {
        let n = board.len();
        let transform = |v: i32, i:i32| (v<<1)|i;
        let rows = board.iter().map(|row| row.iter().copied().fold(0, transform)).collect::<Vec<_>>();
        let cols = (0..n).map(|i| board.iter().map(|r|r[i]).fold(0, transform)).collect::<Vec<_>>();

        match (Self::get_number(&rows), Self::get_number(&cols)) {
            (Some(r), Some(c)) => (r + c),
            _ => -1
        }
    }
}