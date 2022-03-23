הוראות כלליות לפתיחת הפרוייקט:

התקנת python , react
הורדת mongocompass

התחברות לנתיב: 
1. הורדת הפרוייקט וחילוצו מהזיפ.
2. פתיחת cmd - > הגעה לנתיב של הפרויקט : לתיקיית Kalena:
	בתוך תיקייה זו ישנם 3 תיקיות : backend, frontend, venv
	
3. BACKEND:
	3.1) התקנת סביבה וירטואלית:
	- לבעלי windows לרשום בcmd :
	venv\Scripts\activate.bat

	3.2) כניסה לתיקייה backend : לרשום בcmd ללא המרכאות:
	 - " pip install -r requirements.txt"  בmac נרשום pip3
	- ". code" (פותח את הפרוייקט בVS)
	- "python main.py" -> מריץ את הפרוייקט (צריכה להתקבל שורה אחרונה שרשום בה: 	
					- Application startup complete.

	3.3) נתיב כניסה לAPI : 
	http://localhost:8080/docs#/
	כדי להתחבר יש לבצע הרשמה -user_signup ולאחר מכן user_login -> לקבל token ולשים אותו ב-Authorize
	שבראש העמוד בצד ימין.

4. FRONTEND:
בנייה התחלתית עם התקנת חבילות צד שלישי:
npx create-react-app my-app
cd my-app
npm start

לקבל את הפרויקט כמו שהוא, ובדר"כ יש הוראות ברורות בטרמינל, שאליו מגיעים ע"י סרגל הכלים במעלה המסך של
ה- Visual Studio Code:
-> New Terminal -> npm start

אם יש שגיאה שחסר קבצים, אז רשום אילו פקודות לרשום על מנת לקבל את הקבצים החסרים, כגון:
npm install
npm install node-sass
npm install sass

אם יש שגיאה של env:
npm add --dev dotenv
ואז להוסף קובץ שנקרא:
.env בתיקיית הפרוייקט
ולרשום בפנים:
SKIP_PREFLIGHT_CHECK=true

אם יש שגיאת קומפילציה בפתיחת הפרויקט (מה שלא אמור לקרות), ניתן לטפל כפי שרשום בשגיאה:
npm rebuild node-sass



 
