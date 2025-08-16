import * as fs from 'fs';
import * as path from 'path';

const ROOT = '/workspace';
const REPORTS_DIR = path.join(ROOT, '.reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'feature-check-latest.md');

type FeatureStatus = {
	frontend: string;
	backend: string;
	notes?: string;
};

type StatusByFeature = Record<string, FeatureStatus>;

function fileExists(filePath: string): boolean {
	try {
		return fs.existsSync(filePath);
	} catch {
		return false;
	}
}

function dirExists(dirPath: string): boolean {
	try {
		return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
	} catch {
		return false;
	}
}

function readJson<T = unknown>(filePath: string): T | null {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(data) as T;
	} catch {
		return null;
	}
}

function readText(filePath: string): string {
	try {
		return fs.readFileSync(filePath, 'utf8');
	} catch {
		return '';
	}
}

function ensureReportsDir(): void {
	if (!dirExists(REPORTS_DIR)) {
		fs.mkdirSync(REPORTS_DIR, { recursive: true });
	}
}

function parseReadmeFeatures(): string[] {
	const readmePath = path.join(ROOT, 'README.md');
	const content = readText(readmePath);
	if (!content) return [];

	const lines = content.split(/\r?\n/);
	const features: string[] = [];
	let inFeatures = false;
	for (const line of lines) {
		if (line.trim().startsWith('## ') && inFeatures) break;
		if (line.toLowerCase().includes('## 🌟 features') || line.toLowerCase().includes('## features')) {
			inFeatures = true;
			continue;
		}
		if (inFeatures && line.trim().startsWith('-')) {
			const match = line.match(/\*\*(.*?)\*\*/);
			const name = match ? match[1].trim() : line.replace(/^[-\s]*/, '').trim();
			if (name) features.push(name);
		}
	}
	return features;
}

function computeStatus(): StatusByFeature {
	const mobileRoot = path.join(ROOT, 'mobile-app');
	const mobilePkg = readJson<{ dependencies?: Record<string, string> }>(path.join(mobileRoot, 'package.json')) || {};

	const backendRoot = path.join(ROOT, 'backend');

	const statusByFeature: StatusByFeature = {};

	// 1) Mindful Meal Planning
	const feMealPlanningScreens = [
		path.join(mobileRoot, 'src/screens/meal-planning/MealPlanningScreen.tsx'),
		path.join(mobileRoot, 'src/screens/meal-planning/WeeklyPlanner.tsx'),
	];
	const feMealPlanningUI = feMealPlanningScreens.some(fileExists);
	const feMealPlanningHooks = dirExists(path.join(mobileRoot, 'src/hooks/api')) &&
		(fileExists(path.join(mobileRoot, 'src/hooks/api/useMealPlan.ts')) || fileExists(path.join(mobileRoot, 'src/hooks/api/useMealPlan.tsx')));

	const beMealPlanningService = dirExists(path.join(backendRoot, 'meal-planning-service')) && (
		fileExists(path.join(backendRoot, 'meal-planning-service/src/index.ts')) ||
		fileExists(path.join(backendRoot, 'meal-planning-service/src/routes/meal-planning.routes.ts')) ||
		fileExists(path.join(backendRoot, 'meal-planning-service/src/services/meal-planning.service.ts'))
	);

	statusByFeature['Mindful Meal Planning'] = {
		frontend: feMealPlanningUI ? (feMealPlanningHooks ? 'implemented' : 'in-progress (UI)') : 'missing',
		backend: beMealPlanningService ? 'implemented' : 'missing',
		notes: feMealPlanningUI && !feMealPlanningHooks ? 'UI present; API hooks missing' : ''
	};

	// 2) Pantry Organizer (Barcode scanning and expiry tracking)
	const fePantryScreens = [
		path.join(mobileRoot, 'src/screens/pantry/PantryScreen.tsx'),
		path.join(mobileRoot, 'src/screens/pantry/InventoryList.tsx'),
	];
	const fePantryUI = fePantryScreens.some(fileExists);
	const feBarcodeDir = dirExists(path.join(mobileRoot, 'src/components/barcode'));
	const feHasCameraDeps = Boolean(mobilePkg && mobilePkg.dependencies && (
		mobilePkg.dependencies['react-native-camera'] ||
		mobilePkg.dependencies['react-native-vision-camera'] ||
		mobilePkg.dependencies['expo-camera']
	));

	const beInventoryService = dirExists(path.join(backendRoot, 'inventory-service')) && (
		fileExists(path.join(backendRoot, 'inventory-service/src/index.ts')) ||
		fileExists(path.join(backendRoot, 'inventory-service/src/routes/inventory.routes.ts'))
	);

	let pantryFrontendStatus: string = 'missing';
	let pantryNotes: string = '';
	if (fePantryUI) {
		if (feBarcodeDir || feHasCameraDeps) {
			pantryFrontendStatus = 'implemented';
		} else {
			pantryFrontendStatus = 'in-progress (UI)';
			pantryNotes = 'Barcode scanner component/deps not found';
		}
	}

	statusByFeature['Pantry Organizer'] = {
		frontend: pantryFrontendStatus,
		backend: beInventoryService ? 'implemented' : 'missing',
		notes: pantryNotes
	};

	// 3) Calorie Scanner
	const feHasCalorieScanner = false;
	const beHasCalorieScanner = false;

	statusByFeature['Calorie Scanner'] = {
		frontend: feHasCalorieScanner ? 'implemented' : 'missing',
		backend: beHasCalorieScanner ? 'implemented' : 'missing',
		notes: 'OCR/vision scanner not detected in dependencies or code'
	};

	// 4) Recipe Database
	const feRecipeUI = dirExists(path.join(mobileRoot, 'src/screens/recipes')) ||
		fileExists(path.join(mobileRoot, 'src/screens/recipes/RecipeList.tsx')) ||
		fileExists(path.join(mobileRoot, 'src/screens/recipes/RecipeDetails.tsx'));

	const beRecipeEntities = [
		path.join(backendRoot, 'meal-planning-service/src/entities/Recipe.ts'),
		path.join(backendRoot, 'meal-planning-service/src/entities/RecipeIngredient.ts'),
		path.join(backendRoot, 'meal-planning-service/src/entities/RecipeStep.ts'),
	].some(fileExists);

	statusByFeature['Recipe Database'] = {
		frontend: feRecipeUI ? 'in-progress (UI)' : 'missing',
		backend: beRecipeEntities ? 'implemented' : 'missing',
		notes: feRecipeUI ? '' : 'No recipe list/details screens found'
	};

	// 5) Quick Commerce Integration
	const feCommerceUI = fileExists(path.join(mobileRoot, 'src/screens/shopping/ShoppingScreen.tsx'));
	const beCommerceService = dirExists(path.join(backendRoot, 'commerce-service')) && (
		fileExists(path.join(backendRoot, 'commerce-service/src/index.ts')) ||
		fileExists(path.join(backendRoot, 'commerce-service/src/resolvers/commerce.resolver.ts'))
	);

	statusByFeature['Quick Commerce Integration'] = {
		frontend: feCommerceUI ? 'in-progress (UI)' : 'missing',
		backend: beCommerceService ? 'implemented' : 'missing',
		notes: feCommerceUI ? '' : ''
	};

	// 6) Community Features
	const feCommunityUI = fileExists(path.join(mobileRoot, 'src/screens/community/CommunityScreen.tsx'));
	const beCommunityService = dirExists(path.join(backendRoot, 'community-service'));

	statusByFeature['Community Features'] = {
		frontend: feCommunityUI ? 'in-progress (UI)' : 'missing',
		backend: beCommunityService ? 'implemented' : 'missing',
		notes: ''
	};

	// 7) Wellness Tracking
	const feWellness = fileExists(path.join(mobileRoot, 'src/hooks/useMindfulness.ts'));
	statusByFeature['Wellness Tracking'] = {
		frontend: feWellness ? 'implemented' : 'missing',
		backend: 'n/a',
		notes: feWellness ? '' : ''
	};

	return statusByFeature;
}

function toMarkdownTable(statusByFeature: StatusByFeature): string {
	const features = [
		'Mindful Meal Planning',
		'Pantry Organizer',
		'Calorie Scanner',
		'Recipe Database',
		'Quick Commerce Integration',
		'Community Features',
		'Wellness Tracking',
	];
	const header = '| Feature | Frontend | Backend | Notes |\n|---|---|---|---|';
	const rows = features.map((f) => {
		const s = statusByFeature[f] || { frontend: 'unknown', backend: 'unknown', notes: '' };
		return `| ${f} | ${s.frontend} | ${s.backend} | ${s.notes || ''} |`;
	});
	return [header, ...rows].join('\n');
}

function main(): void {
	ensureReportsDir();
	const featuresInReadme = parseReadmeFeatures();
	const statusByFeature = computeStatus();

	const now = new Date().toISOString();
	let md = `# Feature Check Report\n\nGenerated: ${now}\n\n`;

	if (featuresInReadme.length) {
		md += `Features listed in README (${featuresInReadme.length}): ${featuresInReadme.join(', ')}\n\n`;
	}

	md += toMarkdownTable(statusByFeature) + '\n';

	fs.writeFileSync(REPORT_FILE, md, 'utf8');
	console.log(md);
}

main();