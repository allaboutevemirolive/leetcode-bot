// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/solutions/1450967/simple-solution-c-rust/
impl Solution {
    pub fn max_profit(prices: Vec<i32>) -> i32 {
        let max_profit_vec = prices
            .iter()
            .rev()
            .scan(0, |state, &v| {
                *state = (*state).max(v);
                Some(*state)
            })
            .collect::<Vec<_>>();
        prices
			.iter()
			.zip(max_profit_vec.iter().rev())
			.skip(1)
			.fold(
            (0, prices[0], max_profit_vec[0] - prices[0]),
            |(max_so_far, min_so_far, result), (&v, &l)| {
			    let result = result.max(max_so_far + l - v);
			    let min_so_far = min_so_far.min(v);
			    let max_so_far = max_so_far.max(v - min_so_far);
			    (max_so_far, min_so_far, result)
		    },
        ).2
    }
}