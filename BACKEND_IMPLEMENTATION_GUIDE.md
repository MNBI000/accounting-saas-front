# 🛠️ Backend Implementation Guide: Accounting Module

This guide outlines the necessary backend implementation steps to support the Accounting Module in the frontend. The frontend expects a RESTful API built with Laravel.

## 1. Database Schema & Migrations

### A. Chart of Accounts (`accounts` table)
If not already fully implemented, ensure the `accounts` table supports the hierarchical structure.

```php
Schema::create('accounts', function (Blueprint $table) {
    $table->id();
    $table->string('code')->unique();
    $table->string('name_ar');
    $table->string('name_en')->nullable();
    $table->string('type'); // asset, liability, equity, revenue, expense
    $table->foreignId('parent_id')->nullable()->constrained('accounts')->onDelete('cascade');
    $table->boolean('is_selectable')->default(true); // Can journal entries be posted to this account?
    $table->text('description')->nullable();
    $table->foreignId('branch_id')->nullable()->constrained(); // If multi-branch
    $table->timestamps();
    $table->softDeletes();
});
```

### B. Journal Entries (`journal_entries` table)
This table stores the header information for a journal entry.

```php
Schema::create('journal_entries', function (Blueprint $table) {
    $table->id();
    $table->string('number')->unique(); // e.g., JE-2024-0001
    $table->date('date');
    $table->text('description')->nullable();
    $table->decimal('amount', 15, 2); // Total Debit (must equal Total Credit)
    $table->string('status')->default('draft'); // draft, posted
    $table->foreignId('created_by')->constrained('users');
    $table->foreignId('branch_id')->nullable()->constrained();
    $table->timestamps();
    $table->softDeletes();
});
```

### C. Journal Entry Details (`journal_entry_details` table)
This table stores the individual debit and credit lines.

```php
Schema::create('journal_entry_details', function (Blueprint $table) {
    $table->id();
    $table->foreignId('journal_entry_id')->constrained('journal_entries')->onDelete('cascade');
    $table->foreignId('account_id')->constrained('accounts');
    $table->decimal('debit', 15, 2)->default(0);
    $table->decimal('credit', 15, 2)->default(0);
    $table->string('description')->nullable(); // Line item description
    $table->timestamps();
});
```

---

## 2. API Routes

Register the following routes in `routes/api.php`. Ensure they are protected by authentication middleware (e.g., Sanctum).

```php
use App\Http\Controllers\AccountController;
use App\Http\Controllers\JournalEntryController;

Route::middleware('auth:sanctum')->group(function () {
    // Accounts (Chart of Accounts)
    Route::apiResource('accounts', AccountController::class);

    // Journal Entries
    Route::apiResource('journal-entries', JournalEntryController::class);
});
```

---

## 3. Controllers & Logic

### A. AccountController
*   **GET /api/accounts**: Return all accounts.
    *   *Recommendation*: Return a flat list. The frontend handles building the tree structure if `parent_id` is present.
*   **POST /api/accounts**: Create a new account. Validate uniqueness of `code`.
*   **PUT /api/accounts/{id}**: Update account details.
*   **DELETE /api/accounts/{id}**: Delete an account. Prevent deletion if it has children or related journal entries.

### B. JournalEntryController

#### 1. List Entries
*   **GET /api/journal-entries**
*   **Response**: Paginated list of entries. Include `created_by` user name.

#### 2. Create Entry
*   **POST /api/journal-entries**
*   **Request Body**:
    ```json
    {
        "date": "2024-01-24",
        "description": "Opening Balance",
        "amount": 1000,
        "lines": [
            { "account_id": 1, "description": "Cash", "debit": 1000, "credit": 0 },
            { "account_id": 2, "description": "Capital", "debit": 0, "credit": 1000 }
        ]
    }
    ```
*   **Logic**:
    1.  Validate that `lines` array has at least 2 items.
    2.  Validate that Total Debit == Total Credit.
    3.  Generate a unique `number` (e.g., auto-increment or format like `JE-{Y}-{0000}`).
    4.  Create `JournalEntry` record.
    5.  Loop through `lines` and create `JournalEntryDetail` records.
    6.  (Optional) If status is 'posted', update account balances immediately (or use a separate service for posting).

#### 3. Show Entry
*   **GET /api/journal-entries/{id}**
*   **Response**: Include the `lines` relationship (details) and `account` info for each line.

#### 4. Update Entry
*   **PUT /api/journal-entries/{id}**
*   **Logic**: Allow updates only if status is 'draft'. If 'posted', deny or require a reversal entry.
*   **Implementation**: Sync `lines` (delete old details, insert new ones).

#### 5. Delete Entry
*   **DELETE /api/journal-entries/{id}**
*   **Logic**: Allow delete only if 'draft'.

---

## 4. API Resources (JSON Formatting)

Use Laravel API Resources to format the response cleanly.

**JournalEntryResource.php**
```php
public function toArray($request)
{
    return [
        'id' => $this->id,
        'number' => $this->number,
        'date' => $this->date,
        'description' => $this->description,
        'amount' => $this->amount,
        'status' => $this->status,
        'created_by' => $this->user->name ?? 'System',
        'lines' => JournalEntryDetailResource::collection($this->whenLoaded('details')),
        'created_at' => $this->created_at,
    ];
}
```

**JournalEntryDetailResource.php**
```php
public function toArray($request)
{
    return [
        'id' => $this->id,
        'account_id' => $this->account_id,
        'account_name' => $this->account->name_ar, // or name_en based on locale
        'description' => $this->description,
        'debit' => $this->debit,
        'credit' => $this->credit,
    ];
}
```

## 5. Validation Rules (FormRequest)

**StoreJournalEntryRequest.php**
```php
public function rules()
{
    return [
        'date' => 'required|date',
        'description' => 'nullable|string',
        'lines' => 'required|array|min:2',
        'lines.*.account_id' => 'required|exists:accounts,id',
        'lines.*.debit' => 'required|numeric|min:0',
        'lines.*.credit' => 'required|numeric|min:0',
    ];
}

public function withValidator($validator)
{
    $validator->after(function ($validator) {
        $lines = $this->input('lines');
        $totalDebit = collect($lines)->sum('debit');
        $totalCredit = collect($lines)->sum('credit');

        if (abs($totalDebit - $totalCredit) > 0.01) {
            $validator->errors()->add('lines', 'The journal entry is not balanced. Total Debit must equal Total Credit.');
        }
    });
}
```
