// https://leetcode.com/problems/basic-calculator/solutions/2291167/c-rust-faster-than-100-explained/
class Solution {
public:
	int calculate(string s) {
		stack<int> st;
		long long num = 0;
		int sign=1; // we are taking the signed as +ve
		int ans = 0; 
		st.push(sign);
		for(char& ch : s){
			if(ch==' ')continue; // if char is empty space ingnore
			else if(ch =='+' || ch=='-'){  // if char is + or -, we will increament  the ans and update the sign for future evaluation
				ans+= num*sign;
				sign = st.top()*((ch=='+')?1:-1);
				num=0;
			}
			else if(ch=='(')st.push(sign); // if char is '(' then push the prev sign for evaluating the parenthesis
			else if(ch==')')st.pop(); pop the sign 
			else {
				num = num*10 + (ch-'0'); 
			}
		}
		ans +=num*sign;
		return ans;
	}
};