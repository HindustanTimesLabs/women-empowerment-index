# women-empowerment-index

Hindustan Times computed 'Women Empowerment Index' using data from [National Family Health Survey 4]

The survey provides us the following eight indictors under the category **'Women’s Empowerment and Gender-Based Violence'**:
    
  - Currently married women who usually participate in household decisions (%)
  - Women who worked in the last 12 months who were paid in cash (%)
  - Ever-married women who have ever experienced spousal violence (%)
  - Ever-married women who have experienced violence during any pregnancy (%)
  - Women owning a house and/or land (alone or jointly with others) (%)
  - Women having a bank or savings account that they themselves use (%)
  - Women having a mobile phone that they themselves use (%)
  - Women age 15-24 years who use hygienic methods of protection during their menstrual period (%)
 
### Ranking Methodology
The methodgology used in an NIPFP [paper] which rates Indian states based on their governance performance was replicated for calculating the *HT Women Empowerment Index.* We also referred to this paper by [Planning Commission].

1. We compiled state-wise data for the eight indicators from NFHS fact sheets. 
2. We order the data such that higher value means better rank. For instance, more women having bank accounts is a positive indicator, so data remains as it is. But higher proportion of women reporting to have experienced spousal violence is worse, hence we take inverse of this parameter. 
3. Indicators were then transformed to a uniform (0,1) scale to make them comparable. 
4. Then, we standardise the data set (by subtracting the mean value of each variable across states and dividing by its standard deviation) to a uniform (0,1) scale. Now each variable has a mean of zero and a standard deviation of 1.
5. To arrive at  a state’s score, we take average of values of all eight indicators. This score is termed as the *HT Women Empowerment Index*.

### Comparison: 2005-06 and 2015-16
Comparable data from previous round of NFHS held in 2005-06 was available for four indicators and for 28 States/UTs. We calculated a modified index taking just these four indicators and 28 states (in NFHS-4, data for all 36 States/UTS is available). The method remains sames. 

### Data

**Raw data and final results in this sheet:** https://docs.google.com/spreadsheets/d/179onU4jvFPqhLlM-7ZJu5xv0LQLOsQq-TrMJNFQkSjI/edit?usp=sharing

For questions, send an email at samarth.bansal@hindustantimes.com


   [National Family Health Survey 4]: <http://rchiips.org/nfhs/factsheet_NFHS-4.shtml>
   [paper]: http://www.nipfp.org.in/media/medialibrary/2016/04/WP_2016_164.pdf
   [Planning Commission]: http://planningcommission.nic.in/reports/articles/article_state.pdf
