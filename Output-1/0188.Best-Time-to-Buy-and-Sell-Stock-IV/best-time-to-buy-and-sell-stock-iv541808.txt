// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/solutions/541808/easy-to-read-rust-o-n-log-n-time-solution-0ms-2-1mb/
macro_rules! unwrap_or_return_0 {
    ( $e:expr ) => {
        match $e {
            Some(x) => x,
            None => return 0,
        }
    }
}

impl Solution {
    pub fn max_profit(k: i32, prices: Vec<i32>) -> i32 {
        
        //alternation between peaks and valleys
        let mut extremums = LocalExtremums::new(prices.into_iter()).peekable();

        let first = unwrap_or_return_0!(extremums.next());

        let second = *unwrap_or_return_0!(extremums.peek());

        //remove first local extremum if it is a peak (first > second)
        //the first extremum is now a valley
        let extremums = if first > second { None } else { Some(first) }
            .into_iter()
            .chain(extremums);
        
        //stack containing transactions (stored as (valley, peak) pairs)
		//that could be combined more efficiently with following transactions
		//iterval[i]⊃interval[i+1]
        let mut combinable_transactions = vec![];
		
		//validated (i.e. not combinable more efficiently with following transactions) transactions 
        let mut validated_transactions = vec![];
        
        for (mut valley2, peak2) in RegroupByPairs::new(extremums) {
            while let Some((valley1, peak1)) = combinable_transactions.pop() {
                //trying to combine the new transaction (valley2, peak2)
				//with the transaction (valley1, peak1) at the top of the combinable transactions stack 
				if valley1 < valley2 {
                    if peak1 <= peak2 {
                        //combining of the transactions by swapping their valleys
						//so that one transaction is included in the other
                        //validation of the inner transaction because
						//it is not combinable more efficiently with following transactions anymore 
						//storage of the outer transaction as (valley2, peak2) for further combining
						//onto the next transaction on the stack to try to combinate with (valley2, peak2)
                        validated_transactions.push((valley2, peak1));
                        valley2 = valley1;
                    } else {
                        //(valley1, peak1)⊃(valley2, peak2)
                        //push both to the stack and break
                        combinable_transactions.push((valley1, peak1));
                        break;
                    }
                } else {
                    //validation of the transaction (valley1, peak1) because
					//it is not combinable efficiently with following transactions anymore 
					//onto the next transaction on the stack to try combinate with (valley2, peak2)
                    validated_transactions.push((valley1, peak1));
                }
            }
            combinable_transactions.push((valley2, peak2));
        }

        //validation of the transactions from the combinable_transactions stack
        validated_transactions.extend_from_slice(&combinable_transactions);

        //descending order sort of profits (= peak - valley)
        validated_transactions.sort_by_key(|(valley, peak)| valley - peak);
		
		//return the sum of the k biggest profits
        validated_transactions
            .into_iter()
            .take(k as usize)
            .map(|(valley, peak)| peak - valley)
            .sum()
    }
}
    
struct RegroupByPairs<T, U>
where
    T: Iterator<Item = U>,
{
    values: T,
}

impl<T, U> RegroupByPairs<T, U>
where
    T: Iterator<Item = U>,
{
    fn new(values: T) -> RegroupByPairs<T, U> {
        RegroupByPairs { values }
    }
}

impl<T, U> Iterator for RegroupByPairs<T, U>
where
    T: Iterator<Item = U>,
{
    type Item = (U, U);
	//in case of an odd number of items, the orphan item at the end will be dropped
    fn next(&mut self) -> Option<Self::Item> {
		//may be risky if the next() method is not called in reading order
        Some((self.values.next()?, self.values.next()?))
    }
}

struct LocalExtremums<T>
where
    T: Iterator<Item = i32>,
{
    values: std::iter::Peekable<T>,
    last_extremum: Option<i32>,
}

impl<T> LocalExtremums<T>
where
    T: Iterator<Item = i32>,
{
    fn new(values: T) -> LocalExtremums<T> {
        let values = values.peekable();

        LocalExtremums {
            values,
            last_extremum: None,
        }
    }
}

impl<T> Iterator for LocalExtremums<T>
where
    T: Iterator<Item = i32>,
{
    type Item = i32;
    fn next(&mut self) -> Option<Self::Item> {
        let next_extremum = if let Some(last_extremum) = self.last_extremum {
            while *self.values.peek()? == last_extremum {
                self.values.next()?;
            }

            let mut current = self.values.next()?;

            let increasing = current > last_extremum;
            let decreasing = !increasing;

            while let Some(next) = self.values.peek() {
                //local extremum found
                if (current < *next) && decreasing || (current > *next) && increasing {
                    break;
                }
                current = self.values.next()?;
            }
            current
        } else {
            self.values.next()?
        };

        self.last_extremum = Some(next_extremum);

        Some(next_extremum)
    }
}