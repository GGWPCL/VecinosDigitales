<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'community_id',
        'category_id',
        'author_id',
        'original_title',
        'mutated_title',
        'original_content',
        'mutated_content',
        'is_approved',
    ];

    /**
     * Get the community that owns the post.
     */
    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    /**
     * Get the category that owns the post.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the author that owns the post.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the comments for the post.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the users that follow this post.
     */
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows')
            ->withTimestamps();
    }

    /**
     * Get the users that up voted this post.
     */
    public function upVotedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'up_votes')
            ->withTimestamps();
    }

    /**
     * Get the poll associated with the post.
     */
    public function poll(): HasOne
    {
        return $this->hasOne(Poll::class);
    }
}
